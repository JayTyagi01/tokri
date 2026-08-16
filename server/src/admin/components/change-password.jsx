import React, { useState } from 'react'
import { Box, Button, H3, Input, Label, Text } from '@adminjs/design-system'
import { ApiClient, useNotice } from 'adminjs'

const api = new ApiClient()

const EyeIcon = ({ hidden }) =>
  hidden ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6A2 2 0 0 0 13.4 13.4" />
      <path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c5 0 9 4.5 10 8a12.8 12.8 0 0 1-2.1 3.6" />
      <path d="M6.6 6.6C4.3 8 2.7 10.2 2 12c1 3.5 5 8 10 8 1.5 0 2.9-.4 4.1-1" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )

function PasswordField({ id, label, value, onChange, visible, onToggle }) {
  return (
    <Box mb="lg">
      <Label htmlFor={id} required>{label}</Label>
      <Box position="relative" width="100%">
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete="new-password"
          style={{ width: '100%', paddingRight: 42 }}
        />
        <button
          type="button"
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={onToggle}
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
          <EyeIcon hidden={visible} />
        </button>
      </Box>
    </Box>
  )
}

const ChangePassword = (props) => {
  const { record, resource } = props
  const addNotice = useNotice()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const close = () => {
    window.history.back()
  }

  const save = async (event) => {
    event.preventDefault()
    setError('')
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('New password and confirm password must be the same.')
      return
    }

    setSaving(true)
    try {
      const response = await api.recordAction({
        resourceId: resource.id,
        recordId: record.id,
        actionName: 'changePassword',
        method: 'post',
        data: { password, confirmPassword },
      })
      const notice = response.data?.notice
      if (notice?.type === 'error') {
        setError(notice.message || 'Could not save password.')
        return
      }
      if (notice) addNotice(notice)
      const redirectUrl = response.data?.redirectUrl
      if (redirectUrl) {
        window.location.href = redirectUrl
        return
      }
      close()
    } catch (err) {
      setError(err.message || 'Could not save password.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(2, 12, 8, 0.62)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 80,
        padding: 16,
      }}
    >
      <Box
        as="form"
        onSubmit={save}
        bg="white"
        width={['100%', '420px']}
        p="xl"
        style={{ borderRadius: 16, boxShadow: '0 24px 70px rgba(2, 44, 34, 0.28)' }}
      >
        <H3 mb="sm">Change password</H3>
        <Text mb="xl" color="#64748b">
          Set a new password for {record?.params?.name || record?.params?.email || 'this user'}.
        </Text>

        <PasswordField
          id="new-password"
          label="New password"
          value={password}
          onChange={setPassword}
          visible={showPassword}
          onToggle={() => setShowPassword((value) => !value)}
        />
        <PasswordField
          id="confirm-password"
          label="Confirm password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          visible={showConfirm}
          onToggle={() => setShowConfirm((value) => !value)}
        />

        {error ? (
          <Text mb="lg" color="#dc2626">{error}</Text>
        ) : null}

        <Box display="flex" justifyContent="flex-end" style={{ gap: 10 }}>
          <Button type="button" variant="text" onClick={close} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? 'Saving…' : 'Save password'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default ChangePassword
