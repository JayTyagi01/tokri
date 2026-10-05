import React, { useEffect, useState } from 'react'
import { ApiClient, useNotice } from 'adminjs'
import { StatusSwitch, isFlagOn } from './form-controls.jsx'

const api = new ApiClient()

const StatusToggle = (props) => {
  const { record, resource, property, where, onChange } = props
  const addNotice = useNotice()
  const field = property?.path || 'isActive'
  const actionName = property?.custom?.actionName || 'toggleActive'
  const onLabel = property?.custom?.onLabel || 'Active'
  const offLabel = property?.custom?.offLabel || 'Inactive'
  const raw = record?.params?.[field]
  const [checked, setChecked] = useState(isFlagOn(raw))
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setChecked(isFlagOn(raw))
  }, [raw, record?.id])

  const persist = async (next) => {
    if (!record?.id) return
    setBusy(true)
    try {
      const response = await api.recordAction({
        resourceId: resource.id,
        recordId: record.id,
        actionName,
        method: 'post',
        data: { [field]: next },
      })
      const saved = response.data?.record?.params?.[field]
      setChecked(saved === undefined ? next : isFlagOn(saved))
      const notice = response.data?.notice
      addNotice({
        message: notice?.message || (next ? `Marked ${onLabel.toLowerCase()}` : `Marked ${offLabel.toLowerCase()}`),
        type: notice?.type || 'success',
      })
    } catch (error) {
      addNotice({ message: error.message || 'Could not update status.', type: 'error' })
    } finally {
      setBusy(false)
    }
  }

  const handleChange = (next) => {
    if (where === 'edit' && typeof onChange === 'function') {
      setChecked(next)
      onChange(field, next)
      return
    }
    persist(next)
  }

  return (
    <StatusSwitch
      compact={where !== 'edit'}
      checked={checked}
      disabled={busy}
      onLabel={onLabel}
      offLabel={offLabel}
      title={where === 'edit' ? (checked ? onLabel : offLabel) : undefined}
      hint={where === 'edit' ? property?.description : undefined}
      onChange={handleChange}
    />
  )
}

export default StatusToggle
