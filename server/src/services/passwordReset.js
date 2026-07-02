import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'
import { env } from '../config/env.js'
import { sendPasswordResetEmail } from '../services/email.js'

const TOKEN_TTL_MS = 60 * 60 * 1000

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export function generateResetToken() {
  return crypto.randomBytes(32).toString('hex')
}

export async function createPasswordResetForUser(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user?.email) {
    throw new Error('User must have an email address to receive a reset link')
  }

  const token = generateResetToken()
  const tokenHash = hashToken(token)

  await prisma.passwordResetToken.updateMany({
    where: { userId, usedAt: null },
    data: { usedAt: new Date() },
  })

  await prisma.passwordResetToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    },
  })

  const resetUrl = `${env.appUrl}${env.adminPath}/reset-password?token=${token}`
  await sendPasswordResetEmail(user, resetUrl)

  return { resetUrl, email: user.email }
}

export async function requestPasswordResetByIdentifier(identifier) {
  const user = await prisma.user.findFirst({
    where: {
      isActive: true,
      role: { in: ['staff', 'admin', 'super_admin'] },
      OR: [{ email: identifier }, { username: identifier }],
    },
  })

  if (!user?.email) {
    return { ok: true }
  }

  await createPasswordResetForUser(user.id)
  return { ok: true }
}

export async function resetPasswordWithToken(token, newPassword) {
  const tokenHash = hashToken(token)

  const record = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  })

  if (!record?.user) {
    throw new Error('Invalid or expired reset link')
  }

  const password = await bcrypt.hash(newPassword, 10)

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { password },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
  ])

  return { ok: true }
}
