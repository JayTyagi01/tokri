import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, H4, Icon, Text } from '@adminjs/design-system'
import { BasePropertyComponent, useNotice, useRecord } from 'adminjs'

const withoutTrailingSlash = (value) => String(value || '').replace(/\/+$/, '')

const ReviewEdit = (props) => {
  const { record: initialRecord, resource } = props
  const { record, handleChange, submit: handleSubmit, loading } = useRecord(
    initialRecord,
    resource.id,
  )
  const addNotice = useNotice()
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')

  const params = record?.params || {}
  const custom = resource?.options?.custom || {}
  const apiBaseUrl = withoutTrailingSlash(custom.apiBaseUrl || '/api/v1')

  const imageUrl = useMemo(() => {
    if (!params.image) return ''
    if (/^(https?:|data:|blob:)/.test(params.image)) return params.image
    return `${withoutTrailingSlash(custom.appUrl || window.location.origin)}${params.image}`
  }, [custom.appUrl, params.image])

  const displayedImageUrl = previewUrl || imageUrl

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const uploadImage = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('folder', 'reviews')
    formData.append('file', file)

    const localPreviewUrl = URL.createObjectURL(file)
    setPreviewUrl(localPreviewUrl)
    setUploading(true)

    try {
      const response = await fetch(`${apiBaseUrl}/media/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || 'Image upload failed')
      }

      const media = await response.json()
      handleChange('image', media.path)
      setPreviewUrl(
        /^(https?:|data:|blob:)/.test(media.path)
          ? media.path
          : `${withoutTrailingSlash(custom.appUrl || window.location.origin)}${media.path}`,
      )
      addNotice({ message: 'Image uploaded successfully', type: 'success' })
    } catch (error) {
      addNotice({ message: error.message || 'Could not upload image', type: 'error' })
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const submit = (event) => {
    event.preventDefault()
    handleSubmit().catch(() => {
      addNotice({ message: 'Could not save review', type: 'error' })
    })
  }

  const propertyByPath = Object.fromEntries(
    resource.editProperties.map((property) => [property.propertyPath, property]),
  )
  const renderProperty = (propertyPath) => {
    const property = propertyByPath[propertyPath]
    if (!property) return null

    return (
      <BasePropertyComponent
        key={property.propertyPath}
        where="edit"
        onChange={handleChange}
        property={property}
        resource={resource}
        record={record}
      />
    )
  }

  const remainingProperties = resource.editProperties.filter(
    (property) => !['title', 'name', 'content', 'image'].includes(property.propertyPath),
  )

  return (
    <Box as="form" onSubmit={submit} p="xl">
      <Box mb="xl">
        <H4 mb="sm">Review</H4>
        <Text opacity={0.75}>
          Add the review title, reviewer name, content, and an optional reviewer image.
        </Text>
      </Box>

      <Box mb="lg">{renderProperty('title')}</Box>
      <Box mb="lg">{renderProperty('name')}</Box>
      <Box mb="lg">{renderProperty('content')}</Box>

      <Box mb="xl" p="xl" border="1px solid #dbe3ea" borderRadius="16px" bg="#ffffff">
        <H4 mb="md">Reviewer Image</H4>

        {displayedImageUrl ? (
          <Box mb="lg">
            <img
              src={displayedImageUrl}
              alt={params.name || 'Reviewer'}
              style={{
                width: 140,
                height: 140,
                objectFit: 'cover',
                borderRadius: '50%',
                border: '1px solid #dbe3ea',
              }}
            />
          </Box>
        ) : (
          <Text mb="lg" opacity={0.7}>
            No image selected yet.
          </Text>
        )}

        <input ref={fileRef} type="file" accept="image/*" onChange={uploadImage} />
        <Text mt="sm" opacity={0.7}>
          JPG, PNG, GIF, or WebP up to 5MB.
        </Text>
      </Box>

      {remainingProperties.map((property) => (
        <Box key={property.propertyPath} mb="lg">
          {renderProperty(property.propertyPath)}
        </Box>
      ))}

      <Box mt="xl">
        <Button variant="contained" type="submit" disabled={loading || uploading}>
          {loading || uploading ? <Icon icon="Loader" spin /> : null}
          Save review
        </Button>
      </Box>
    </Box>
  )
}

export default ReviewEdit
