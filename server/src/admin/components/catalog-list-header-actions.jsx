import React, { useMemo, useRef, useState } from 'react'
import { Box, ButtonGroup, MessageBox } from '@adminjs/design-system'
import { useFilterDrawer, useTranslation } from 'adminjs'

function adminRootPath() {
  const match = window.location.pathname.match(/^(.*)\/resources\//)
  return match ? match[1] : window.location.pathname.replace(/\/$/, '')
}

function catalogConfig(resourceId) {
  if (resourceId === 'Category') {
    return { exportUrl: 'categories/export', importUrl: 'categories/import' }
  }
  if (resourceId === 'Product') {
    return { exportUrl: 'products/export', importUrl: 'products/import' }
  }
  return null
}

export default function CatalogListHeaderActions({ resource, onImported }) {
  const { translateButton, translateAction } = useTranslation()
  const { toggleFilter, filtersCount } = useFilterDrawer()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const fileRef = useRef(null)

  const resourceId = resource.id
  const config = catalogConfig(resourceId)
  const root = adminRootPath()

  const handleImport = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !config) return

    setLoading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${root}/catalog/${config.importUrl}`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.message || 'Import failed.')
      }

      const errorCount = data.errors?.length || 0
      setMessage({
        type: errorCount ? 'info' : 'success',
        text:
          errorCount > 0
            ? `Import finished. ${data.created} added, ${data.updated} updated. ${errorCount} row(s) could not be imported.`
            : `Import finished. ${data.created} added, ${data.updated} updated.`,
      })
      onImported?.()
    } catch (error) {
      setMessage({ type: 'danger', text: error.message || 'Import failed.' })
    } finally {
      setLoading(false)
    }
  }

  const buttons = useMemo(() => {
    if (!config) return []

    const items = [
      {
        label: 'Export',
        variant: 'text',
        href: `${root}/catalog/${config.exportUrl}`,
      },
      {
        label: loading ? 'Importing...' : 'Import',
        variant: 'text',
        onClick: loading ? undefined : () => fileRef.current?.click(),
      },
    ]

    const newAction = resource.resourceActions?.find((action) => action.name === 'new')
    if (newAction) {
      items.push({
        icon: newAction.icon,
        label: translateAction(newAction.label, resourceId),
        variant: newAction.variant,
        href: `${root}/resources/${resourceId}/actions/new`,
        'data-css': `${resourceId}-new-button`,
      })
    }

    const filterKey = filtersCount > 0 ? 'filterActive' : 'filter'
    items.push({
      label: translateButton(filterKey, resourceId, { count: filtersCount }),
      onClick: toggleFilter,
      icon: 'Filter',
      'data-css': `${resourceId}-filter-button`,
    })

    return items
  }, [
    config,
    root,
    loading,
    resource.resourceActions,
    resourceId,
    translateAction,
    translateButton,
    filtersCount,
    toggleFilter,
  ])

  if (!config) return null

  return (
    <>
      <Box
        mt="xl"
        mb="default"
        display="flex"
        justifyContent="flex-end"
        flexShrink={0}
        px={['default', 0]}
        style={{ marginTop: '-52px' }}
      >
        <ButtonGroup buttons={buttons} />
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          style={{ display: 'none' }}
          onChange={handleImport}
        />
      </Box>

      {message && (
        <Box mb="default" px={['default', 0]}>
          <MessageBox
            variant={message.type}
            message={message.text}
            onCloseClick={() => setMessage(null)}
          />
        </Box>
      )}
    </>
  )
}
