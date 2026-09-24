import React, { useEffect, useMemo } from 'react'
import { Box, Button, H3, Icon, Text } from '@adminjs/design-system'
import { useNotice, useRecord } from 'adminjs'
import { StatusSwitch, isFlagOn } from './form-controls.jsx'

const PartnerEdit = (props) => {
  const { record: initialRecord, resource, action } = props
  const addNotice = useNotice()
  const { record, handleChange, submit: handleSubmit, loading } = useRecord(
    initialRecord,
    resource.id,
  )
  const params = record?.params || {}
  const isNew = action?.name === 'new' || !record?.id
  const readOnly = action?.name === 'show'
  const hasPassword = Boolean(params.hasPassword)
  const isActive = isNew && (params.isActive === undefined || params.isActive === '')
    ? true
    : isFlagOn(params.isActive)

  useEffect(() => {
    if (isNew && (params.isActive === undefined || params.isActive === '')) {
      handleChange('isActive', true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew])

  const errors = useMemo(() => record?.errors || {}, [record?.errors])
  const setField = (key, value) => handleChange(key, value)

  const submit = (event) => {
    event.preventDefault()
    handleSubmit()
      .then((response) => {
        const notice = response?.data?.notice
        if (notice?.type === 'error') {
          addNotice({ message: notice.message || 'Could not save partner', type: 'error' })
          return
        }
        addNotice({
          message: isNew
            ? 'Partner saved. A password email will be sent if they do not have a password yet.'
            : 'Partner updated',
          type: 'success',
        })
      })
      .catch(() => {
        addNotice({ message: 'Could not save partner. Please try again.', type: 'error' })
      })
    return false
  }

  return (
    <Box as="form" onSubmit={submit} className="tokri-coupon-form">
      <Box className="tokri-coupon-hero">
        <H3 color="white">{isNew ? 'Add delivery partner' : params.name || 'Delivery partner'}</H3>
        <Text color="white">
          They log in to the Tokriii Partner app with this email after setting a password from the invite mail.
        </Text>
      </Box>

      <Box className="tokri-coupon-grid">
        <section className="tokri-coupon-card">
          <h4>Account status</h4>
          <p>Inactive partners cannot log in, even if they already set a password.</p>
          <StatusSwitch
            checked={isActive}
            disabled={readOnly}
            title={isActive ? 'Active' : 'Inactive'}
            hint={isActive ? 'Can sign in to the partner app' : 'Login is blocked until you turn this on'}
            onChange={(next) => setField('isActive', next)}
          />
          {!isNew ? (
            <Text mt="lg" opacity={0.7}>
              {hasPassword ? 'Password is already set.' : 'No password yet — send the invite email after saving.'}
            </Text>
          ) : null}
        </section>

        <section className="tokri-coupon-card">
          <h4>Login details</h4>
          <p>Email is used to create and reset the partner password. No SMS is sent.</p>
          <label className="tokri-coupon-label">
            Email
            <input
              className="tokri-coupon-input"
              type="email"
              required
              readOnly={readOnly}
              value={params.email || ''}
              onChange={(event) => setField('email', event.target.value)}
              placeholder="partner@example.com"
            />
            {errors.email ? <span className="tokri-field-error">{errors.email.message}</span> : (
              <span className="tokri-field-hint">Password link is sent to this inbox</span>
            )}
          </label>
          <label className="tokri-coupon-label">
            Mobile number
            <input
              className="tokri-coupon-input"
              inputMode="numeric"
              maxLength={10}
              required
              readOnly={readOnly}
              value={params.phone || ''}
              onChange={(event) => setField('phone', event.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit number"
            />
            {errors.phone ? <span className="tokri-field-error">{errors.phone.message}</span> : null}
          </label>
        </section>
      </Box>

      <section className="tokri-coupon-card">
        <h4>Profile</h4>
        <p>Name is shown on orders. Address is optional and only for your team.</p>
        <div className="tokri-coupon-two">
          <label className="tokri-coupon-label">
            Full name
            <input
              className="tokri-coupon-input"
              required
              readOnly={readOnly}
              value={params.name || ''}
              onChange={(event) => setField('name', event.target.value)}
              placeholder="Partner name"
            />
            {errors.name ? <span className="tokri-field-error">{errors.name.message}</span> : null}
          </label>
          <label className="tokri-coupon-label">
            Address <span className="tokri-optional">(optional)</span>
            <input
              className="tokri-coupon-input"
              readOnly={readOnly}
              value={params.address || ''}
              onChange={(event) => setField('address', event.target.value)}
              placeholder="Area, city, or hub"
            />
          </label>
        </div>
        <label className="tokri-coupon-label">
          Internal notes <span className="tokri-optional">(optional)</span>
          <textarea
            className="tokri-coupon-input tokri-textarea"
            rows={4}
            readOnly={readOnly}
            value={params.notes || ''}
            onChange={(event) => setField('notes', event.target.value)}
            placeholder="Shift timing, vehicle, or anything your team should remember"
          />
        </label>
      </section>

      {readOnly ? null : (
        <Box className="tokri-coupon-actions">
          <Button variant="contained" type="submit" disabled={loading}>
            {loading ? <Icon icon="Loader" spin /> : null}
            {isNew ? 'Create partner' : 'Save partner'}
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default PartnerEdit
