/**
 * Rotate the admin password without touching any other data.
 *
 * Usage (PowerShell):
 *   $env:ADMIN_EMAIL="admin@metplast.com"; $env:ADMIN_PASSWORD="your-strong-pass"; npm run db:reset-admin
 * Usage (bash):
 *   ADMIN_EMAIL="admin@metplast.com" ADMIN_PASSWORD="your-strong-pass" npm run db:reset-admin
 *
 * DATABASE_URL must point at the target database.
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@metplast.com'
  const name = process.env.ADMIN_NAME || 'Metplast Admin'
  const password = process.env.ADMIN_PASSWORD

  if (!password || password.length < 8) {
    throw new Error(
      'ADMIN_PASSWORD is required and must be at least 8 characters. ' +
      'Set ADMIN_EMAIL and ADMIN_PASSWORD, then run: npm run db:reset-admin'
    )
  }

  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hash, name },
    create: { email, name, password: hash },
  })

  console.log(`Admin password updated for ${user.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
