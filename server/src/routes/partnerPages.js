import express from 'express'
import { Router } from 'express'
import { requestPartnerPasswordReset, setPartnerPasswordWithToken } from '../services/partnerPassword.js'

const router = Router()
const parseForm = express.urlencoded({ extended: true })

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function page(title, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} · Tokriii Partner</title>
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
    button {
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
    }
    a { color: #047857; font-weight: 600; }
    .alert { padding: 10px 12px; border-radius: 10px; margin-bottom: 14px; font-size: .9rem; }
    .alert.ok { background: #ecfdf5; color: #065f46; }
    .alert.err { background: #fef2f2; color: #991b1b; }
  </style>
</head>
<body>
  <div class="card">${body}</div>
</body>
</html>`
}

function setPasswordForm(token, error) {
  return `
    ${error ? `<div class="alert err">${escapeHtml(error)}</div>` : ''}
    <h1>Create your password</h1>
    <p>Set a password for the Tokriii Partner app. Use the email your manager saved in admin.</p>
    <form method="post">
      <input type="hidden" name="token" value="${escapeHtml(token)}" />
      <label for="password">New password</label>
      <input id="password" name="password" type="password" required minlength="8" autocomplete="new-password" />
      <label for="confirm">Confirm password</label>
      <input id="confirm" name="confirm" type="password" required minlength="8" autocomplete="new-password" />
      <button type="submit">Save password</button>
    </form>
  `
}

function forgotForm(error, ok) {
  return `
    ${ok ? `<div class="alert ok">${escapeHtml(ok)}</div>` : ''}
    ${error ? `<div class="alert err">${escapeHtml(error)}</div>` : ''}
    <h1>Forgot password</h1>
    <p>Enter the email your manager saved for your partner account. If it matches, we will send a new password link.</p>
    <form method="post">
      <label for="email">Email</label>
      <input id="email" name="email" type="email" required autocomplete="email" />
      <button type="submit">Send password link</button>
    </form>
  `
}

router.get('/set-password', (req, res) => {
  const token = String(req.query.token || '')
  if (!token) {
    return res
      .status(400)
      .send(page('Link expired', '<div class="alert err">This link is missing or invalid. Ask your manager to send a new password email, or use Forgot password.</div>'))
  }
  res.send(page('Create password', setPasswordForm(token)))
})

router.post('/set-password', parseForm, async (req, res) => {
  const token = String(req.body?.token || '')
  const password = String(req.body?.password || '')
  const confirm = String(req.body?.confirm || '')

  if (!token) {
    return res.status(400).send(page('Link expired', '<div class="alert err">This link is missing or invalid.</div>'))
  }
  if (password.length < 8) {
    return res.status(400).send(page('Create password', setPasswordForm(token, 'Password must be at least 8 characters.')))
  }
  if (password !== confirm) {
    return res.status(400).send(page('Create password', setPasswordForm(token, 'Passwords do not match.')))
  }

  try {
    await setPartnerPasswordWithToken(token, password)
    res.send(
      page(
        'Password saved',
        `<div class="alert ok">Your password is ready.</div>
         <p>Open the Tokriii Partner app and sign in with your email and this password.</p>`,
      ),
    )
  } catch (error) {
    res.status(400).send(
      page(
        'Link expired',
        `<div class="alert err">${escapeHtml(error.message || 'Invalid or expired link. Ask your manager to send a new email.')}</div>
         <p><a href="forgot">Forgot password</a></p>`,
      ),
    )
  }
})

router.get('/forgot', (_req, res) => {
  res.send(page('Forgot password', forgotForm()))
})

router.post('/forgot', parseForm, async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase()
  if (!email || !email.includes('@')) {
    return res.status(400).send(page('Forgot password', forgotForm('Enter a valid email address.')))
  }
  try {
    await requestPartnerPasswordReset(email)
    res.send(
      page(
        'Forgot password',
        forgotForm(
          '',
          'If that email is an active partner account, a password link has been sent. Check your inbox.',
        ),
      ),
    )
  } catch (error) {
    res.status(400).send(page('Forgot password', forgotForm(error.message || 'Could not send the email.')))
  }
})

export default router
