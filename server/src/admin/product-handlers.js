import { prisma } from '../lib/prisma.js'

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function uniqueProductSlug(value, currentId) {
  const base = slugify(value)
  if (!base) return ''

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
  const source = String(payload.slug ?? '').trim() || String(payload.name ?? '').trim()

  if (!source) {
    throw new Error('Product name is required to generate a slug.')
  }

  payload.slug = await uniqueProductSlug(source, currentId)

  if (payload.mediaId && !payload.image) {
    const media = await prisma.media.findUnique({ where: { id: payload.mediaId } })
    if (media) payload.image = media.path
  }

  request.payload = payload
  return request
}
