import React, { memo, useCallback } from 'react'
import { FormGroup, FormMessage, Label, TinyMCE } from '@adminjs/design-system'

const DEFAULT_OPTIONS = {
  plugins: [
    'code',
    'link',
    'lists',
    'image',
    'table',
    'autolink',
    'preview',
    'searchreplace',
    'wordcount',
    'media',
    'codesample',
  ],
  toolbar:
    'undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image table codesample | code | removeformat',
  height: 400,
}

const RichtextEdit = (props) => {
  const { property, record, onChange } = props
  const value = record.params?.[property.path] ?? ''
  const error = record.errors?.[property.path]

  const handleUpdate = useCallback(
    (newValue) => {
      onChange(property.path, newValue)
    },
    [onChange, property.path],
  )

  const options = {
    ...DEFAULT_OPTIONS,
    ...(property.props || {}),
  }

  return (
    <FormGroup error={Boolean(error)}>
      <Label required={property.isRequired}>{property.label}</Label>
      <TinyMCE value={value} onChange={handleUpdate} options={options} />
      <FormMessage>{error?.message}</FormMessage>
    </FormGroup>
  )
}

export default memo(RichtextEdit)
