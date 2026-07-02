import express from 'express'
import { Router } from 'express'
import { env } from '../config/env.js'
import {
  requestPasswordResetByIdentifier,
  resetPasswordWithToken,
} from '../services/passwordReset.js'

const router = Router()
const parseForm = express.urlencoded({ extended: true })

function page(title, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} · Tokriii Admin</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: "Plus Jakarta Sans", system-ui, sans-serif;
      background: linear-gradient(135deg, #022c22, #047857);
      color: #0f172a;
    }
    .card {
      width: min(420px, 92vw);
      background: #fff;
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 20px 50px rgba(0,0,0,.25);
    }
    h1 { margin: 0 0 8px; font-size: 1.35rem; color: #022c22; }
    p { margin: 0 0 18px; color: #475569; line-height: 1.5; font-size: .95rem; }
    label { display: block; font-weight: 600; margin-bottom: 6px; font-size: .9rem; }
    input {
      width: 100%;
      padding: 11px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      margin-bottom: 14px;
      font-size: 1rem;
    }
    button, .link-btn {
      display: inline-block;
      width: 100%;
      border: 0;
      border-radius: 10px;
      padding: 12px;
      background: #047857;
      color: #fff;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
    }
    .muted { margin-top: 16px; text-align: center; font-size: .9rem; }
    .muted a { color: #047857; font-weight: 600; }
    .alert {
      padding: 10px 12px;
      border-radius: 10px;
      margin-bottom: 14px;
      font-size: .9rem;
    }
    .alert.ok { background: #ecfdf5; color: #065f46; }
    .alert.err { background: #fef2f2; color: #991b1b; }
  </style>
</head>
<body>
  <div class="card">${body}</div>
</body>
</html>`
}

router.get('/forgot-password', (_req, res) => {
  res.send(
    page(
      'Forgot password',
      `
      <h1>Reset password</h1>
      <p>Enter your admin email or username. We will send a reset link if the account exists.</p>
      <form method="post" action="${env.adminPath}/forgot-password">
        <label for="identifier">Email or username</label>
        <input id="identifier" name="identifier" type="text" required autocomplete="username" />
        <button type="submit">Send reset link</button>
      </form>
      <p class="muted"><a href="${env.adminPath}/login">Back to login</a></p>
    `,
    ),
  )
})

router.post('/forgot-password', parseForm, async (req, res) => {
  const identifier = String(req.body?.identifier || '').trim()

  try {
    if (identifier) {
      await requestPasswordResetByIdentifier(identifier)
    }

    res.send(
      page(
        'Check your email',
        `
        <h1>Check your email</h1>
        <p>If an admin account exists for that email or username, a password reset link has been sent.</p>
        <p class="muted"><a href="${env.adminPath}/login">Back to login</a></p>
      `,
      ),
    )
  } catch (error) {
    res.status(400).send(
      page(
        'Reset failed',
        `
        <div class="alert err">${error.message || 'Unable to send reset email'}</div>
        <p class="muted"><a href="${env.adminPath}/forgot-password">Try again</a></p>
      `,
      ),
    )
  }
})

router.get('/reset-password', (req, res) => {
  const token = String(req.query.token || '')

  if (!token) {
    return res.redirect(`${env.adminPath}/forgot-password`)
  }

  res.send(
    page(
      'Set new password',
      `
      <h1>Set new password</h1>
      <p>Choose a new password for your admin account.</p>
      <form method="post" action="${env.adminPath}/reset-password">
        <input type="hidden" name="token" value="${token.replace(/"/g, '&quot;')}" />
        <label for="password">New password</label>
        <input id="password" name="password" type="password" required minlength="8" autocomplete="new-password" />
        <label for="confirm">Confirm password</label>
        <input id="confirm" name="confirm" type="password" required minlength="8" autocomplete="new-password" />
        <button type="submit">Update password</button>
      </form>
    `,
    ),
  )
})

router.post('/reset-password', parseForm, async (req, res) => {
  const token = String(req.body?.token || '')
  const password = String(req.body?.password || '')
  const confirm = String(req.body?.confirm || '')

  if (!token) {
    return res.redirect(`${env.adminPath}/forgot-password`)
  }

  if (password.length < 8) {
    return res.status(400).send(
      page(
        'Set new password',
        `
        <div class="alert err">Password must be at least 8 characters.</div>
        <form method="post" action="${env.adminPath}/reset-password">
          <input type="hidden" name="token" value="${token.replace(/"/g, '&quot;')}" />
          <label for="password">New password</label>
          <input id="password" name="password" type="password" required minlength="8" />
          <label for="confirm">Confirm password</label>
          <input id="confirm" name="confirm" type="password" required minlength="8" />
          <button type="submit">Update password</button>
        </form>
      `,
      ),
    )
  }

  if (password !== confirm) {
    return res.status(400).send(
      page(
        'Set new password',
        `
        <div class="alert err">Passwords do not match.</div>
        <form method="post" action="${env.adminPath}/reset-password">
          <input type="hidden" name="token" value="${token.replace(/"/g, '&quot;')}" />
          <label for="password">New password</label>
          <input id="password" name="password" type="password" required minlength="8" />
          <label for="confirm">Confirm password</label>
          <input id="confirm" name="confirm" type="password" required minlength="8" />
          <button type="submit">Update password</button>
        </form>
      `,
      ),
    )
  }

  try {
    await resetPasswordWithToken(token, password)

    res.send(
      page(
        'Password updated',
        `
        <div class="alert ok">Your password has been updated.</div>
        <p class="muted"><a class="link-btn" href="${env.adminPath}/login">Sign in</a></p>
      `,
      ),
    )
  } catch (error) {
    res.status(400).send(
      page(
        'Reset failed',
        `
        <div class="alert err">${error.message || 'Invalid or expired reset link'}</div>
        <p class="muted"><a href="${env.adminPath}/forgot-password">Request a new link</a></p>
      `,
      ),
    )
  }
})

export default router
