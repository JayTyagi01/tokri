import { prisma } from '../lib/prisma.js'

const DEFAULT_SLUG = 'product'

export function slugify(value) {
  const slug = String(value || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || DEFAULT_SLUG
}

export async function uniqueProductSlug(value, currentId) {
  const base = slugify(value)
  let candidate = base
  let suffix = 2

  while (
    await prisma.product.findFirst({
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

export async function prepareProductPayload(request) {
  if (request.method !== 'post') return request

  const payload = request.payload || {}
  const currentId = request.params?.recordId

  payload.slug = await uniqueProductSlug(payload.slug || payload.name, currentId)

  if (payload.mediaId && !payload.image) {
    const media = await prisma.media.findUnique({ where: { id: payload.mediaId } })
    if (media) payload.image = media.path
  }

  request.payload = payload
  return request
}
