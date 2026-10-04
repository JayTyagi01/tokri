import React from 'react'
import { Loader, Table, TableBody } from '@adminjs/design-system'
import {
  NoRecords,
  RecordInList,
  RecordsTableHeader,
  SelectedRecords,
} from 'adminjs'

const getResourceElementCss = (resourceId, suffix) => `${resourceId}-${suffix}`

/**
 * AdminJS marks the header checkbox checked when ANY row is selected.
 * Override so: none = unchecked, some = indeterminate, all = checked.
 */
export default function RecordsTable(props) {
  const {
    resource,
    records,
    actionPerformed,
    sortBy,
    direction,
    isLoading,
    onSelect,
    selectedRecords,
    onSelectAll,
  } = props

  if (!records.length) {
    if (isLoading) return <Loader />
    return <NoRecords resource={resource} />
  }

  const selectedCount = selectedRecords
    ? records.filter((record) => selectedRecords.some((selected) => selected.id === record.id)).length
    : 0
  const selectedAll = selectedCount > 0 && selectedCount === records.length
  const indeterminate = selectedCount > 0 && selectedCount < records.length
  const recordsHaveBulkAction = !!records.find((record) => record.bulkActions.length)

  const contentTag = getResourceElementCss(resource.id, 'table')
  const selectedTag = getResourceElementCss(resource.id, 'table-selected-records')
  const bodyTag = getResourceElementCss(resource.id, 'table-body')

  return (
    <Table data-css={contentTag}>
      <SelectedRecords
        resource={resource}
        selectedRecords={selectedRecords}
        data-css={selectedTag}
      />
      <RecordsTableHeader
        properties={resource.listProperties}
        titleProperty={resource.titleProperty}
        direction={direction}
        sortBy={sortBy}
        onSelectAll={recordsHaveBulkAction ? onSelectAll : undefined}
        selectedAll={selectedAll}
        indeterminate={indeterminate}
      />
      <TableBody data-css={bodyTag}>
        {records.map((record) => (
          <RecordInList
            record={record}
            resource={resource}
            key={record.id}
            actionPerformed={actionPerformed}
            isLoading={isLoading}
            onSelect={onSelect}
            isSelected={
              selectedRecords && !!selectedRecords.find((selected) => selected.id === record.id)
            }
          />
        ))}
      </TableBody>
    </Table>
  )
}
