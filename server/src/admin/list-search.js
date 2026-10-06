import { prisma } from '../lib/prisma.js'

export function readAdminSearch(query = {}) {
  const direct = query.q ?? query.query
  if (direct != null && String(direct).trim()) {
    return String(direct).trim()
  }

  const filters = query.filters
  if (filters && typeof filters === 'object' && !Array.isArray(filters)) {
    for (const value of Object.values(filters)) {
      if (value == null || typeof value === 'object') continue
      const text = String(value).trim()
      if (text) return text
    }
  }

  for (const [key, value] of Object.entries(query)) {
    if (!String(key).startsWith('filters.')) continue
    const text = String(value ?? '').trim()
    if (text) return text
  }

  return ''
}

function fieldWhere(field, term) {
  if (field.includes('.')) {
    const [rel, col] = field.split('.')
    return { [rel]: { is: { [col]: { contains: term } } } }
  }
  return { [field]: { contains: term } }
}

export function searchWhere(searchFields, term) {
  if (!term || !searchFields?.length) return {}
  return { OR: searchFields.map((field) => fieldWhere(field, term)) }
}

function prismaForResource(resource) {
  const name = String(resource.id())
  return prisma[name.charAt(0).toLowerCase() + name.slice(1)]
}

function toAdminParams(row) {
  const params = {}
  for (const [key, value] of Object.entries(row)) {
    if (value === null || value === undefined) {
      params[key] = value
      continue
    }
    if (typeof value === 'object' && typeof value.toNumber === 'function') {
      params[key] = value.toString()
      continue
    }
    if (value instanceof Date) {
      params[key] = value
      continue
    }
    if (Array.isArray(value) || (typeof value === 'object' && value.constructor === Object)) {
      continue
    }
    params[key] = value
  }
  return params
}

function findRelatedResource(admin, resourceId) {
  try {
    return admin?.findResource(resourceId)
  } catch {
    return null
  }
}

export function createSearchListHandler(searchFields, options = {}) {
  const { include, populate, extraWhere, defaultSortBy = 'id' } = options

  return async (request, _response, context) => {
    const query = request.query || {}
    const perPage = Math.min(Number(query.perPage) || 10, 50)
    const page = Number(query.page) || 1
    const searchTerm = readAdminSearch(query)
    const requestedSort = String(query.sortBy || '')
    const relationKeys = new Set(Object.keys(include || {}))
    const sortBy = /^[A-Za-z][A-Za-z0-9_]*$/.test(requestedSort) && !relationKeys.has(requestedSort)
      ? requestedSort
      : defaultSortBy
    const direction = query.direction === 'asc' ? 'asc' : 'desc'
    const search = searchWhere(searchFields, searchTerm)
    const where = extraWhere && Object.keys(extraWhere).length
      ? (search.OR ? { AND: [extraWhere, search] } : extraWhere)
      : search
    const delegate = prismaForResource(context.resource)
    if (!delegate?.findMany || !delegate?.count) {
      throw new Error(`Admin search is not configured for ${context.resource.id()}`)
    }

    const [rows, total] = await Promise.all([
      delegate.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { [sortBy]: direction },
        ...(include ? { include } : {}),
      }),
      delegate.count({ where }),
    ])

    const records = rows.map((row) => {
      const record = context.resource.build(toAdminParams(row))
      if (populate) {
        for (const [path, resourceId] of Object.entries(populate)) {
          const related = row[path]
          if (!related) continue
          const relatedResource = findRelatedResource(context._admin, resourceId)
          if (!relatedResource) continue
          record.populate(path, relatedResource.build(toAdminParams(related)))
        }
      }
      return record.toJSON(context.currentAdmin)
    })

    return {
      meta: { total, perPage, page, direction, sortBy },
      records,
    }
  }
}
