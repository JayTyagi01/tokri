import { prisma } from '../lib/prisma.js'

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function uniqueCategorySlug(value, currentId) {
  const base = slugify(value)
  if (!base) return ''

  let candidate = base
  let suffix = 2

  while (
    await prisma.category.findFirst({
      where: {
        slug: candidate,
        ...(currentId ? { NOT: { id: currentId } } : {}),
      },
      select: { id: true },
    })
  ) {
    candidate = `${base}-${suffix}`
    suffix += 1
  }

  return candidate
}

export async function prepareCategoryPayload(request) {
  if (request.method !== 'post') return request

  const payload = request.payload || {}
  const currentId = request.params?.recordId
  const source = String(payload.slug ?? '').trim() || String(payload.label ?? '').trim()

  if (!source) {
    throw new Error('Category label is required to generate a slug.')
  }

  payload.slug = await uniqueCategorySlug(source, currentId)

  // Keep image paths from custom upload fields (AdminJS may omit hidden props)
  if (payload.image != null) {
    payload.image = String(payload.image).trim() || null
  }
  if (payload.bannerImage != null) {
    payload.bannerImage = String(payload.bannerImage).trim() || null
  }

  request.payload = payload
  return request
}
