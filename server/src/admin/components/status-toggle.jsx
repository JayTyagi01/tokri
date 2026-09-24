import React, { useEffect, useState } from 'react'
import { ApiClient, useNotice } from 'adminjs'
import { StatusSwitch, isFlagOn } from './form-controls.jsx'

const api = new ApiClient()

const StatusToggle = (props) => {
  const { record, resource, property, where, onChange } = props
  const addNotice = useNotice()
  const raw = record?.params?.[property?.path] ?? record?.params?.isActive
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
        actionName: 'toggleActive',
        method: 'post',
        data: { isActive: next },
      })
      const saved = response.data?.record?.params?.isActive
      setChecked(saved === undefined ? next : isFlagOn(saved))
      const notice = response.data?.notice
      addNotice({
        message: notice?.message || (next ? 'Marked active' : 'Marked inactive'),
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
      onChange(property.path, next)
      return
    }
    persist(next)
  }

  return (
    <StatusSwitch
      compact={where !== 'edit'}
      checked={checked}
      disabled={busy}
      title={where === 'edit' ? (checked ? 'Active' : 'Inactive') : undefined}
      hint={where === 'edit' ? property?.description : undefined}
      onChange={handleChange}
    />
  )
}

export default StatusToggle
