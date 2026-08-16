import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

function createPrisma() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

function getPrisma() {
  const existing = globalForPrisma.prisma
  if (existing?.cart && existing?.cartItem && existing?.deviceToken) {
    return existing
  }
  return createPrisma()
}

export const prisma = getPrisma()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
