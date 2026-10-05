import { ValidationError } from 'adminjs'
import { prisma } from '../lib/prisma.js'

function toBoolean(value, fallback = true) {
  if (value === undefined || value === null || value === '') return fallback
  return value === true || value === 'true' || value === 'on' || value === 1 || value === '1'
}

function emptyToNull(value) {
  const text = String(value || '').trim()
  return text || null
}

export async function prepareReviewPayload(request) {
  if (request.method !== 'post') return request
  const payload = { ...(request.payload || {}) }
  const title = String(payload.title || '').trim()
  const name = String(payload.name || '').trim()
  const content = String(payload.content || '').trim()
  const rating = Math.min(5, Math.max(1, Number(payload.rating) || 5))

  if (!title) throw new ValidationError({ title: { message: 'Title is required.' } })
  if (!name) throw new ValidationError({ name: { message: 'Reviewer name is required.' } })
  if (!content) throw new ValidationError({ content: { message: 'Review text is required.' } })

  request.payload = {
    title,
    name,
    content,
    rating,
    image: emptyToNull(payload.image),
    isApproved: toBoolean(payload.isApproved, true),
  }
  return request
}

export async function toggleReviewApprovedAction(request, _response, context) {
  const review = await prisma.review.findUnique({ where: { id: request.params.recordId } })
  if (!review) throw new Error('Review not found')
  const raw = request.payload?.isApproved ?? request.payload?.isActive
  const next = raw === undefined ? !review.isApproved : toBoolean(raw, true)
  const updated = await prisma.review.update({
    where: { id: review.id },
    data: { isApproved: next },
  })
  return {
    record: context.resource.build(updated).toJSON(context.currentAdmin),
    notice: {
      message: updated.isApproved
        ? `"${updated.title}" is visible on the website.`
        : `"${updated.title}" is hidden from the website.`,
      type: 'success',
    },
  }
}
