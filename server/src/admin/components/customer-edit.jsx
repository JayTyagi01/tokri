import React, { useMemo } from 'react'
import { Box, Button, H3, Icon, Text } from '@adminjs/design-system'
import { useNotice, useRecord } from 'adminjs'
import { StatusSwitch, isFlagOn } from './form-controls.jsx'

function pad(value) {
  return String(value).padStart(2, '0')
}

function toDateInput(value) {
  if (!value) return ''
  const text = String(value)
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10)
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function formatWhen(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

function parseAddresses(params) {
  const raw = params.addresses
  if (Array.isArray(raw)) return raw.filter(Boolean)
  if (raw && typeof raw === 'object') return [raw]
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed.filter(Boolean)
      if (parsed && typeof parsed === 'object') return [parsed]
    } catch {
      // flattened AdminJS params below
    }
  }

  const grouped = {}
  Object.entries(params).forEach(([key, value]) => {
    const match = key.match(/^addresses\.(\d+)\.(.+)$/)
    if (!match || value === undefined || value === null || value === '') return
    const [, index, field] = match
    grouped[index] = grouped[index] || {}
    grouped[index][field] = value
  })
  return Object.keys(grouped)
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => grouped[key])
}

function addressLines(address) {
  return [
    address.line1,
    address.line2,
    [address.city, address.state, address.pincode].filter(Boolean).join(', '),
    address.landmark ? `Landmark: ${address.landmark}` : '',
  ].filter(Boolean)
}

const CustomerEdit = (props) => {
  const { record: initialRecord, resource } = props
  const addNotice = useNotice()
  const { record, handleChange, submit: handleSubmit, loading } = useRecord(
    initialRecord,
    resource.id,
  )
  const params = record?.params || {}
  const isActive = params.isActive === undefined || params.isActive === ''
    ? true
    : isFlagOn(params.isActive)
  const addresses = useMemo(() => parseAddresses(params), [params])
  const errors = useMemo(() => record?.errors || {}, [record?.errors])
  const setField = (key, value) => handleChange(key, value)

  const submit = (event) => {
    event.preventDefault()
    handleSubmit()
      .then((response) => {
        const notice = response?.data?.notice
        if (notice?.type === 'error') {
          addNotice({ message: notice.message || 'Could not save customer', type: 'error' })
          return
        }
        addNotice({ message: 'Customer updated', type: 'success' })
      })
      .catch(() => {
        addNotice({ message: 'Could not save customer. Please try again.', type: 'error' })
      })
    return false
  }

  return (
    <Box as="form" onSubmit={submit} className="tokri-coupon-form">
      <Box className="tokri-coupon-hero">
        <H3 color="white">{params.name || 'Customer'}</H3>
        <Text color="white">
          +91 {params.phone || '—'} · joined {formatWhen(params.createdAt)}
        </Text>
      </Box>

      <Box className="tokri-coupon-grid">
        <section className="tokri-coupon-card">
          <h4>Account status</h4>
          <p>Inactive customers cannot sign in with this mobile number.</p>
          <StatusSwitch
            checked={isActive}
            title={isActive ? 'Active' : 'Inactive'}
            hint={isActive ? 'Can log in on the website and app' : 'Login is blocked until you turn this on'}
            onChange={(next) => setField('isActive', next)}
          />
        </section>

        <section className="tokri-coupon-card">
          <h4>Profile</h4>
          <p>Phone comes from OTP login and stays as the customer’s login id.</p>
          <label className="tokri-coupon-label">
            Name
            <input
              className="tokri-coupon-input"
              value={params.name || ''}
              onChange={(event) => setField('name', event.target.value)}
              placeholder="Customer name"
            />
            {errors.name ? <span className="tokri-field-error">{errors.name.message}</span> : null}
          </label>
          <div className="tokri-coupon-two">
            <label className="tokri-coupon-label">
              Mobile
              <input className="tokri-coupon-input" value={params.phone || ''} readOnly />
            </label>
            <label className="tokri-coupon-label">
              Date of birth
              <input
                className="tokri-coupon-input"
                type="date"
                value={toDateInput(params.dateOfBirth)}
                onChange={(event) => setField('dateOfBirth', event.target.value)}
              />
              {errors.dateOfBirth ? <span className="tokri-field-error">{errors.dateOfBirth.message}</span> : null}
            </label>
          </div>
        </section>
      </Box>

      <section className="tokri-coupon-card">
        <h4>Saved addresses</h4>
        <p>
          {addresses.length
            ? `${addresses.length} address${addresses.length === 1 ? '' : 'es'} saved in the customer account.`
            : 'This customer has not saved a delivery address yet.'}
        </p>
        {addresses.length ? (
          <div className="tokri-address-grid">
            {addresses.map((address, index) => (
              <article key={address.id || `${address.pincode}-${index}`} className="tokri-address-card">
                <div className="tokri-address-top">
                  <span className="tokri-address-label">{address.label || 'Address'}</span>
                  {address.pincode ? <span className="tokri-address-pin">{address.pincode}</span> : null}
                </div>
                <strong>{address.name || params.name || 'Customer'}</strong>
                {address.phone ? <span className="tokri-address-phone">+91 {address.phone}</span> : null}
                {addressLines(address).map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <Box className="tokri-coupon-actions">
        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? <Icon icon="Loader" spin /> : null}
          Save customer
        </Button>
      </Box>
    </Box>
  )
}

export default CustomerEdit
