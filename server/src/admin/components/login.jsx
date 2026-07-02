import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  FormGroup,
  H2,
  Input,
  Label,
  MessageBox,
  Text,
} from '@adminjs/design-system'
import { useTranslation } from 'adminjs'

const REMEMBERED_LOGIN_KEY = 'tokri_admin_login'

const Login = () => {
  const { action, errorMessage } = window.__APP_STATE__ || {}
  const { translateMessage } = useTranslation()
  const adminRoot = action?.replace(/\/login$/, '') || ''
  const forgotPasswordUrl = `${adminRoot}/forgot-password`
  const [identifier, setIdentifier] = useState('')
  const [rememberLogin, setRememberLogin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const rememberedLogin = window.localStorage.getItem(REMEMBERED_LOGIN_KEY)
    if (rememberedLogin) {
      setIdentifier(rememberedLogin)
      setRememberLogin(true)
    }
  }, [])

  const handleSubmit = (event) => {
    const form = event.currentTarget
    const emailInput = form.elements.namedItem('email')
    const value =
      (emailInput && 'value' in emailInput ? String(emailInput.value) : identifier).trim()

    if (emailInput && 'value' in emailInput) {
      emailInput.value = value
    }

    if (rememberLogin && value) {
      window.localStorage.setItem(REMEMBERED_LOGIN_KEY, value)
    } else {
      window.localStorage.removeItem(REMEMBERED_LOGIN_KEY)
    }
  }

  return (
    <Box
      flex
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bg="linear-gradient(135deg, #022c22, #047857)"
      p="xl"
    >
      <Box
        bg="white"
        width={['100%', '440px']}
        borderRadius="18px"
        boxShadow="0 24px 70px rgba(2, 44, 34, 0.35)"
        p="x3"
      >
        <H2 color="#022c22" mb="sm">Tokriii CMS</H2>
        <Text color="#64748b" mb="xl">
          Sign in with your admin email or username to manage products, orders, and content.
        </Text>

        {errorMessage ? (
          <MessageBox
            mb="lg"
            message={errorMessage.split(' ').length > 1 ? errorMessage : translateMessage(errorMessage)}
            variant="danger"
          />
        ) : null}

        <Box as="form" action={action} method="POST" onSubmit={handleSubmit}>
          <FormGroup>
            <Label required>Email or username</Label>
            <Input
              name="email"
              placeholder="Enter email or username"
              autoComplete="username"
              defaultValue={identifier}
              key={identifier || 'login-email'}
            />
          </FormGroup>

          <FormGroup>
            <Label required>Password</Label>
            <Box position="relative" width="100%">
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter password"
                autoComplete="current-password"
                style={{ width: '100%', paddingRight: 42 }}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((value) => !value)}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 0,
                  background: 'transparent',
                  color: '#047857',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 26,
                  height: 26,
                  padding: 0,
                }}
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.6A2 2 0 0 0 13.4 13.4" />
                    <path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c5 0 9 4.5 10 8a12.8 12.8 0 0 1-2.1 3.6" />
                    <path d="M6.6 6.6C4.3 8 2.7 10.2 2 12c1 3.5 5 8 10 8 1.5 0 2.9-.4 4.1-1" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </Box>
          </FormGroup>

          <Box display="flex" alignItems="center" mb="lg">
            <input
              id="remember-login"
              type="checkbox"
              checked={rememberLogin}
              onChange={(event) => setRememberLogin(event.target.checked)}
              style={{ marginRight: 8 }}
            />
            <label htmlFor="remember-login" style={{ color: '#475569', fontSize: 14 }}>
              Remember my email or username on this device
            </label>
          </Box>

          <Button type="submit" variant="contained" width="100%" mt="lg">
            Sign in
          </Button>
        </Box>

        <Text mt="xl" textAlign="center">
          <a href={forgotPasswordUrl} style={{ color: '#047857', fontWeight: 700 }}>
            Forgot password?
          </a>
        </Text>
      </Box>
    </Box>
  )
}

export default Login
