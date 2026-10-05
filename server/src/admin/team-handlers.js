import { ValidationError } from 'adminjs'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'
import { PERMISSION_KEYS, defaultStaffPermissions } from './permissions.js'

function toBoolean(value, fallback = true) {
  if (value === undefined || value === null || value === '') return fallback
  return value === true || value === 'true' || value === 'on' || value === 1 || value === '1'
}

function collectPermissions(payload, fallback) {
  const data = { ...fallback }
  for (const key of Object.keys(PERMISSION_KEYS)) {
    const raw = payload[`permissions.${key}`]
    if (raw !== undefined && raw !== null && raw !== '') {
      data[key] = toBoolean(raw, false)
    }
    delete payload[`permissions.${key}`]
  }
  delete payload.permissions
  return data
}

export async function attachTeamPermissions(response) {
  const id = response?.record?.id || response?.record?.params?.id
  if (!id || !response?.record?.params) return response
  const permissions = await prisma.adminPermission.findUnique({ where: { userId: id } })
  for (const key of Object.keys(PERMISSION_KEYS)) {
    response.record.params[`permissions.${key}`] = Boolean(permissions?.[key])
  }
  return response
}

export async function prepareTeamPayload(request) {
  if (request.method !== 'post') return request

  const payload = { ...(request.payload || {}) }
  const isNew = !request.params?.recordId
  const name = String(payload.name || '').trim()
  const username = String(payload.username || '').trim()
  const email = String(payload.email || '').trim().toLowerCase()
  const role = String(payload.role || 'staff')

  if (!name) throw new ValidationError({ name: { message: 'Name is required.' } })
  if (!username) throw new ValidationError({ username: { message: 'Username is required.' } })
  if (!email) throw new ValidationError({ email: { message: 'Email is required.' } })

  if (isNew) {
    const password = String(payload.password || '').trim()
    const confirmPassword = String(payload.confirmPassword || '').trim()
    if (!password) throw new ValidationError({ password: { message: 'Password is required.' } })
    if (password.length < 6) {
      throw new ValidationError({ password: { message: 'Password must be at least 6 characters.' } })
    }
    if (password !== confirmPassword) {
      throw new ValidationError({ confirmPassword: { message: 'Passwords must match.' } })
    }
    payload.password = await bcrypt.hash(password, 10)
  } else {
    delete payload.password
  }
  delete payload.confirmPassword

  request.teamPermissions = collectPermissions(payload, defaultStaffPermissions)
  payload.name = name
  payload.username = username
  payload.email = email
  payload.role = role
  payload.isActive = toBoolean(payload.isActive, true)
  request.payload = payload
  return request
}

export async function afterTeamSave(response, request) {
  const userId = response.record?.params?.id
  const role = response.record?.params?.role || request.payload?.role
  if (request.method === 'post' && userId && role === 'staff' && request.teamPermissions) {
    await prisma.adminPermission.upsert({
      where: { userId },
      create: { userId, ...request.teamPermissions },
      update: request.teamPermissions,
    })
  }
  return attachTeamPermissions(response)
}

export async function toggleTeamActiveAction(request, _response, context) {
  const user = await prisma.user.findUnique({ where: { id: request.params.recordId } })
  if (!user) throw new Error('Team member not found')
  const raw = request.payload?.isActive ?? request.payload?.record?.params?.isActive
  const next = raw === undefined ? !user.isActive : toBoolean(raw)
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { isActive: next },
  })
  const label = updated.name || updated.username || updated.email
  return {
    record: context.resource.build(updated).toJSON(context.currentAdmin),
    notice: {
      message: updated.isActive ? `${label} can log in.` : `${label} is inactive.`,
      type: 'success',
    },
  }
}
