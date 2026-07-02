import { prisma } from '../lib/prisma.js'

const DEFAULT_SLUG = 'category'

export function slugify(value) {
  const slug = String(value || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || DEFAULT_SLUG
}

export async function uniqueCategorySlug(value, currentId) {
  const base = slugify(value)
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

  payload.slug = await uniqueCategorySlug(payload.slug || payload.label, currentId)

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
