import React, { useEffect, useRef, useState } from 'react'
import { Box, Icon, Input, Pagination, Text } from '@adminjs/design-system'
import {
  RecordsTable,
  useQueryParams,
  useRecords,
  useSelectedRecords,
} from 'adminjs'

const CmsList = (props) => {
  const { resource, setTag } = props
  const titleProp = resource.titleProperty?.name || resource.titleProperty?.propertyPath || 'id'

  const { storeParams, filters } = useQueryParams()
  const {
    records,
    loading,
    direction,
    sortBy,
    page,
    total,
    fetchData,
    perPage,
  } = useRecords(resource.id)
  const {
    selectedRecords,
    handleSelect,
    handleSelectAll,
    setSelectedRecords,
  } = useSelectedRecords(records)

  const [query, setQuery] = useState(() => String(filters?.[titleProp] || ''))
  const debounceRef = useRef(null)
  const storeParamsRef = useRef(storeParams)
  storeParamsRef.current = storeParams

  useEffect(() => {
    setQuery(String(filters?.[titleProp] || ''))
    setSelectedRecords([])
  }, [resource.id, titleProp, setSelectedRecords])

  useEffect(() => {
    if (setTag) setTag(total.toString())
  }, [total, setTag])

  const handleQueryChange = (event) => {
    const value = event.target.value
    setQuery(value)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const trimmed = value.trim()
      storeParamsRef.current({
        page: '1',
        filters: trimmed ? { [titleProp]: trimmed } : {},
      })
    }, 300)
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const handleActionPerformed = () => fetchData()

  const handlePaginationChange = (pageNumber) => {
    storeParams({ page: pageNumber.toString() })
  }

  return (
    <Box variant="grey">
      <Box mb="lg" style={{ position: 'relative', maxWidth: 420 }}>
        <Box
          style={{
            position: 'absolute',
            top: '50%',
            left: 12,
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            opacity: 0.6,
          }}
        >
          <Icon icon="Search" />
        </Box>
        <Input
          value={query}
          onChange={handleQueryChange}
          placeholder={`Search ${resource.name}...`}
          style={{ width: '100%', paddingLeft: 36 }}
        />
      </Box>

      <Box variant="container">
        <RecordsTable
          resource={resource}
          records={records}
          actionPerformed={handleActionPerformed}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
          selectedRecords={selectedRecords}
          direction={direction}
          sortBy={sortBy}
          isLoading={loading}
        />
        <Text mt="xl" textAlign="center">
          <Pagination
            page={page}
            perPage={perPage}
            total={total}
            onChange={handlePaginationChange}
          />
        </Text>
      </Box>
    </Box>
  )
}

export default CmsList
