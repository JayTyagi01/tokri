import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

let transporter = null

function getTransporter() {
  if (!env.smtp.host || !env.smtp.user) return null
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass,
      },
    })
  }
  return transporter
}

export async function sendEmail({ to, subject, html, text }) {
  const transport = getTransporter()

  if (!transport) {
    console.log('[email:dev-fallback]')
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(text || html)
    return { dev: true, sent: false }
  }

  await transport.sendMail({
    from: env.smtp.from,
    to,
    subject,
    html,
    text,
  })

  return { sent: true }
}

export async function sendPasswordResetEmail(user, resetUrl) {
  const subject = 'Reset your Tokriii admin password'
  const displayName = user.name || user.username || 'there'
  const text = `Hello ${displayName},

We received a request to reset your Tokriii admin password.

Open this one-time link within 1 hour:
${resetUrl}

If you did not request this, you can safely ignore this email. Your password will not change.`
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:560px;margin:0 auto;padding:24px;">
      <h2 style="color:#022c22;margin:0 0 12px;">Reset your Tokriii admin password</h2>
      <p>Hello ${displayName},</p>
      <p>We received a request to reset your Tokriii admin password.</p>
      <p>
        <a href="${resetUrl}" style="display:inline-block;background:#047857;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700;">
          Reset password
        </a>
      </p>
      <p>This one-time link is valid for 1 hour.</p>
      <p style="font-size:13px;color:#64748b;">If the button does not work, copy and paste this URL into your browser:<br />${resetUrl}</p>
      <p>If you did not request this, you can safely ignore this email. Your password will not change.</p>
    </div>
  `

  if (!user.email) {
    throw new Error('User has no email address on file')
  }

  return sendEmail({ to: user.email, subject, html, text })
}
