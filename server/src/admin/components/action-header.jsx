import React from 'react'
import { Box } from '@adminjs/design-system'
import { OriginalActionHeader } from 'adminjs'
import CatalogListHeaderActions from './catalog-list-header-actions.jsx'

const CATALOG_RESOURCES = new Set(['Product', 'Category'])

export default function ActionHeader(props) {
  const { OriginalComponent, action, resource } = props
  const BaseHeader = OriginalComponent || OriginalActionHeader
  const isCatalogList = action?.name === 'list' && CATALOG_RESOURCES.has(resource?.id)

  if (!isCatalogList) {
    return <BaseHeader {...props} />
  }

  const { OriginalComponent: _ignored, ...headerProps } = props

  return (
    <Box>
      <BaseHeader {...headerProps} omitActions />
      <CatalogListHeaderActions
        resource={resource}
        onImported={props.actionPerformed}
      />
    </Box>
  )
}
