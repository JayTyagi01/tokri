import React, { useEffect, useMemo, useState } from 'react'
import { Box, Button, H3, Icon, Text } from '@adminjs/design-system'
import { useNotice, useRecord } from 'adminjs'
import { FlagCard, StatusSwitch, isFlagOn } from './form-controls.jsx'

const ROLES = [
  { value: 'staff', title: 'Staff', hint: 'Access only the areas you tick below' },
  { value: 'admin', title: 'Admin', hint: 'Full access to the CMS' },
  { value: 'super_admin', title: 'Super admin', hint: 'Full access, same as admin' },
]

const PERMISSIONS = [
  { key: 'manageProducts', label: 'Products', hint: 'Add and edit products' },
  { key: 'manageCatalog', label: 'Catalog', hint: 'Categories and collections' },
  { key: 'manageMedia', label: 'Media', hint: 'Upload and replace images' },
  { key: 'manageOrders', label: 'Orders', hint: 'View and update orders' },
  { key: 'manageCoupons', label: 'Coupons', hint: 'Create discount codes' },
  { key: 'manageContent', label: 'Content', hint: 'Pages and reviews' },
  { key: 'manageSettings', label: 'Settings', hint: 'Store and homepage settings' },
  { key: 'manageUsers', label: 'Team', hint: 'Create users and change access' },
]

function FieldError({ error }) {
  if (!error?.message) return null
  return <span className="tokri-field-error">{error.message}</span>
}

function PasswordField({ label, value, onChange, error, placeholder }) {
  const [visible, setVisible] = useState(false)
  return (
    <label className="tokri-coupon-label">
      {label}
      <span className="tokri-password-wrap">
        <input
          className="tokri-coupon-input"
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="new-password"
        />
        <button
          type="button"
          className="tokri-password-toggle"
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </span>
      <FieldError error={error} />
    </label>
  )
}

const TeamEdit = (props) => {
  const { record: initialRecord, resource, action } = props
  const addNotice = useNotice()
  const { record, handleChange, submit: handleSubmit, loading } = useRecord(
    initialRecord,
    resource.id,
  )
  const params = record?.params || {}
  const isNew = action?.name === 'new' || !record?.id
  const role = params.role || 'staff'
  const isActive =
    isNew && (params.isActive === undefined || params.isActive === '')
      ? true
      : isFlagOn(params.isActive)

  useEffect(() => {
    if (isNew && (params.isActive === undefined || params.isActive === '')) {
      handleChange('isActive', true)
    }
    if (isNew && !params.role) handleChange('role', 'staff')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew])

  const errors = useMemo(() => record?.errors || {}, [record?.errors])
  const setField = (key, value) => handleChange(key, value)
  const permissionOn = (key) => isFlagOn(params[`permissions.${key}`])

  const submit = (event) => {
    event.preventDefault()
    handleSubmit()
      .then((response) => {
        const notice = response?.data?.notice
        if (notice?.type === 'error') {
          addNotice({ message: notice.message || 'Could not save team member', type: 'error' })
          return
        }
        addNotice({
          message: isNew ? 'Team member created' : 'Team member updated',
          type: 'success',
        })
      })
      .catch(() => {
        addNotice({ message: 'Could not save team member. Please try again.', type: 'error' })
      })
    return false
  }

  return (
    <Box as="form" onSubmit={submit} className="tokri-coupon-form">
      <Box className="tokri-coupon-hero">
        <H3 color="white">{isNew ? 'Add team member' : params.name || 'Team member'}</H3>
        <Text color="white">
          They sign in to Tokriii CMS with username or email. Inactive users cannot log in.
        </Text>
      </Box>

      <Box className="tokri-coupon-grid">
        <section className="tokri-coupon-card">
          <h4>Account status</h4>
          <p>Turn this off to block CMS login without deleting the account.</p>
          <StatusSwitch
            checked={isActive}
            title={isActive ? 'Active' : 'Inactive'}
            hint={isActive ? 'Can sign in to the admin panel' : 'Login is blocked until you turn this on'}
            onChange={(next) => setField('isActive', next)}
          />
        </section>

        <section className="tokri-coupon-card">
          <h4>Role</h4>
          <p>Admin and super admin get full access. Staff only gets the permissions you enable.</p>
          <div className="tokri-choice-row">
            {ROLES.map((item) => (
              <FlagCard
                key={item.value}
                selected={role === item.value}
                title={item.title}
                hint={item.hint}
                onClick={() => setField('role', item.value)}
              />
            ))}
          </div>
        </section>
      </Box>

      <section className="tokri-coupon-card">
        <h4>Login details</h4>
        <p>Username or email can be used on the CMS login screen.</p>
        <div className="tokri-coupon-two">
          <label className="tokri-coupon-label">
            Full name
            <input
              className="tokri-coupon-input"
              required
              value={params.name || ''}
              onChange={(event) => setField('name', event.target.value)}
              placeholder="Team member name"
            />
            <FieldError error={errors.name} />
          </label>
          <label className="tokri-coupon-label">
            Username
            <input
              className="tokri-coupon-input"
              required
              value={params.username || ''}
              onChange={(event) => setField('username', event.target.value.trim())}
              placeholder="e.g. ravi.cms"
            />
            <FieldError error={errors.username} />
          </label>
        </div>
        <label className="tokri-coupon-label">
          Email
          <input
            className="tokri-coupon-input"
            type="email"
            required
            value={params.email || ''}
            onChange={(event) => setField('email', event.target.value)}
            placeholder="name@tokriii.com"
          />
          <FieldError error={errors.email} />
        </label>
        {isNew ? (
          <div className="tokri-coupon-two">
            <PasswordField
              label="Password"
              value={params.password || ''}
              onChange={(value) => setField('password', value)}
              error={errors.password}
              placeholder="At least 6 characters"
            />
            <PasswordField
              label="Confirm password"
              value={params.confirmPassword || ''}
              onChange={(value) => setField('confirmPassword', value)}
              error={errors.confirmPassword}
              placeholder="Type password again"
            />
          </div>
        ) : (
          <span className="tokri-field-hint">Use Change password from the team list to reset login.</span>
        )}
      </section>

      {role === 'staff' ? (
        <section className="tokri-coupon-card">
          <h4>Permissions</h4>
          <p>Only used for staff. Toggle what this person can open in the CMS.</p>
          <div className="tokri-perm-list">
            {PERMISSIONS.map((item) => (
              <div key={item.key} className="tokri-perm-row">
                <span>
                  <strong>{item.label}</strong>
                  <span>{item.hint}</span>
                </span>
                <StatusSwitch
                  compact
                  checked={permissionOn(item.key)}
                  onChange={(next) => setField(`permissions.${item.key}`, next)}
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <Box className="tokri-coupon-actions">
        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? <Icon icon="Loader" spin /> : null}
          {isNew ? 'Create team member' : 'Save team member'}
        </Button>
      </Box>
    </Box>
  )
}

export default TeamEdit
