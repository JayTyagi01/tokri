import React, { useEffect, useRef } from 'react'
import { TableCell, TableHead, TableRow } from '@adminjs/design-system'
import { PropertyHeader } from 'adminjs'

const getResourceElementCss = (resourceId, suffix) => `${resourceId}-${suffix}`

const display = (isTitle) => [
  isTitle ? 'table-cell' : 'none',
  isTitle ? 'table-cell' : 'none',
  'table-cell',
  'table-cell',
]

function SelectAllCheckBox({ checked, indeterminate, onChange }) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = Boolean(indeterminate)
    }
  }, [indeterminate, checked])

  return (
    <label
      className={`tokri-select-all${indeterminate ? ' is-indeterminate' : ''}${checked ? ' is-checked' : ''}`}
      style={{ marginLeft: 5 }}
    >
      <input
        ref={inputRef}
        type="checkbox"
        checked={Boolean(checked)}
        onChange={onChange}
        aria-checked={indeterminate ? 'mixed' : checked ? 'true' : 'false'}
      />
      <span className="tokri-select-all-box" aria-hidden="true">
        {indeterminate ? (
          <svg viewBox="0 0 24 24" className="tokri-select-all-icon">
            <line x1="6" y1="12" x2="18" y2="12" />
          </svg>
        ) : checked ? (
          <svg viewBox="0 0 24 24" className="tokri-select-all-icon">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : null}
      </span>
    </label>
  )
}

export default function RecordsTableHeader(props) {
  const {
    titleProperty,
    properties,
    sortBy,
    direction,
    onSelectAll,
    selectedAll,
    indeterminate,
  } = props

  const contentTag = getResourceElementCss(titleProperty.resourceId, 'table-head')
  const rowTag = `${titleProperty.resourceId}-table-head-row`
  const checkboxCss = `${titleProperty.resourceId}-checkbox-table-cell`

  return (
    <TableHead data-css={contentTag}>
      <TableRow data-css={rowTag}>
        <TableCell data-css={checkboxCss}>
          {onSelectAll ? (
            <SelectAllCheckBox
              onChange={() => onSelectAll()}
              checked={Boolean(selectedAll)}
              indeterminate={Boolean(indeterminate)}
            />
          ) : null}
        </TableCell>
        {properties.map((property) => (
          <PropertyHeader
            display={display(property.isTitle)}
            key={property.propertyPath}
            titleProperty={titleProperty}
            property={property}
            sortBy={sortBy}
            direction={direction}
          />
        ))}
        <TableCell key="actions" style={{ width: 80 }} />
      </TableRow>
    </TableHead>
  )
}
