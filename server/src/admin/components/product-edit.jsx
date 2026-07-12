import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, H4, Icon, Label, Text } from '@adminjs/design-system'
import {
  BasePropertyComponent,
  useNotice,
  useRecord,
} from 'adminjs'

const normalizeSlugInput = (value) => {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const withoutTrailingSlash = (value) => String(value || '').replace(/\/+$/, '')

const ProductEdit = (props) => {
  const { record: initialRecord, resource } = props
  const { record, handleChange, submit: handleSubmit, loading } = useRecord(
    initialRecord,
    resource.id,
  )
  const addNotice = useNotice()
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [slugEdited, setSlugEdited] = useState(Boolean(initialRecord?.params?.slug))
  const [previewUrl, setPreviewUrl] = useState('')
  const [descriptionMode, setDescriptionMode] = useState('wysiwyg')
  const [descriptionValue, setDescriptionValue] = useState('')

  const params = record?.params || {}
  const custom = resource?.options?.custom || {}
  const apiBaseUrl = withoutTrailingSlash(custom.apiBaseUrl || '/api/v1')
  const productUrlBase = withoutTrailingSlash(
    custom.productUrlBase || `${window.location.origin}/product`,
  )
  const slugInput = params.slug ?? ''
  const previewSlug = normalizeSlugInput(slugInput) || normalizeSlugInput(params.name)
  const productUrl = previewSlug ? `${productUrlBase}/${previewSlug}` : null

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

  useEffect(() => {
    setDescriptionValue(String(params.description || ''))
  }, [params.description])

  const onPropertyChange = (propertyPath, value, ...rest) => {
    if (propertyPath === 'slug') {
      setSlugEdited(true)
      handleChange(propertyPath, normalizeSlugInput(value), ...rest)
      return
    }

    handleChange(propertyPath, value, ...rest)

    if (propertyPath === 'name' && !slugEdited) {
      handleChange('slug', normalizeSlugInput(value))
    }
  }

  const uploadImage = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('folder', 'products')
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
      handleChange('mediaId', media.id)
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
      addNotice({ message: 'Could not save product', type: 'error' })
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
        onChange={onPropertyChange}
        property={property}
        resource={resource}
        record={record}
      />
    )
  }

  const remainingProperties = resource.editProperties.filter(
    (property) =>
      !['name', 'slug', 'description', 'image', 'mediaId'].includes(property.propertyPath),
  )

  return (
    <Box as="form" onSubmit={submit} p="xl">
      <Box mb="xl">
        <H4 mb="sm">Product</H4>
        <Text opacity={0.75}>
          Upload the product image, edit the slug, and save. Duplicate slugs are automatically
          renamed like WordPress.
        </Text>
      </Box>

      <Box mb="lg">{renderProperty('name')}</Box>

      <Box mb="xl" p="lg" border="1px solid #dbe3ea" borderRadius="12px" bg="#f8fafc">
        <Label>Slug</Label>
        <Box display="flex" alignItems="center" flexWrap="wrap" gap="sm">
          <Text as="span" fontWeight="bold">
            {`${productUrlBase}/`}
          </Text>
          <input
            value={slugInput}
            placeholder="Leave empty to auto-generate from name"
            onChange={(event) => onPropertyChange('slug', event.target.value)}
            style={{
              minWidth: 260,
              flex: '1 1 260px',
              padding: '10px 12px',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              fontSize: 14,
            }}
          />
        </Box>
        <Text mt="sm" opacity={0.7}>
          Preview:{' '}
          {productUrl ? (
            <a href={productUrl} target="_blank" rel="noreferrer">
              {productUrl}
            </a>
          ) : (
            'Generated from product name when saved'
          )}
        </Text>
        <Text mt="sm" opacity={0.7}>
          Leave empty to auto-generate from the product name. If the slug already exists, a number
          suffix is added automatically (for example, mango-2).
        </Text>
      </Box>

      <Box mb="xl" p="xl" border="1px solid #dbe3ea" borderRadius="16px" bg="#ffffff">
        <Label>Description</Label>
        <Text mb="md" opacity={0.75}>
          Use the WYSIWYG toolbar, or switch to HTML source and preview mode.
        </Text>

        <Box display="flex" gap="sm" mb="md">
          <button
            type="button"
            onClick={() => setDescriptionMode('wysiwyg')}
            style={{
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              padding: '6px 12px',
              background: descriptionMode === 'wysiwyg' ? '#047857' : '#ffffff',
              color: descriptionMode === 'wysiwyg' ? '#ffffff' : '#0f172a',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            WYSIWYG
          </button>
          <button
            type="button"
            onClick={() => setDescriptionMode('html')}
            style={{
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              padding: '6px 12px',
              background: descriptionMode === 'html' ? '#047857' : '#ffffff',
              color: descriptionMode === 'html' ? '#ffffff' : '#0f172a',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            HTML
          </button>
          <button
            type="button"
            onClick={() => setDescriptionMode('preview')}
            style={{
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              padding: '6px 12px',
              background: descriptionMode === 'preview' ? '#047857' : '#ffffff',
              color: descriptionMode === 'preview' ? '#ffffff' : '#0f172a',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Preview
          </button>
        </Box>

        {descriptionMode === 'wysiwyg' ? (
          <Box style={{ minHeight: 220 }}>{renderProperty('description')}</Box>
        ) : descriptionMode === 'html' ? (
          <textarea
            value={descriptionValue}
            onChange={(event) => {
              setDescriptionValue(event.target.value)
              onPropertyChange('description', event.target.value)
            }}
            rows={10}
            placeholder="<p>Write product description in HTML...</p>"
            style={{
              width: '100%',
              minHeight: 220,
              border: '1px solid #cbd5e1',
              borderRadius: 10,
              padding: 12,
              fontSize: 14,
              lineHeight: 1.45,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            }}
          />
        ) : (
          <Box
            p="lg"
            border="1px solid #e2e8f0"
            borderRadius="10px"
            style={{ minHeight: 220, background: '#f8fafc' }}
          >
            {descriptionValue ? (
              <div dangerouslySetInnerHTML={{ __html: descriptionValue }} />
            ) : (
              <Text opacity={0.7}>Preview will appear here.</Text>
            )}
          </Box>
        )}
      </Box>

      <Box mb="xl" p="xl" border="1px solid #dbe3ea" borderRadius="16px" bg="#ffffff">
        <H4 mb="md">Product Image</H4>

        {displayedImageUrl ? (
          <Box mb="lg">
            <img
              src={displayedImageUrl}
              alt={params.name || 'Product preview'}
              style={{
                width: 220,
                height: 220,
                objectFit: 'cover',
                borderRadius: 16,
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
        <Box key={property.propertyPath}>{renderProperty(property.propertyPath)}</Box>
      ))}

      <Box mt="xl">
        <Button variant="contained" type="submit" disabled={loading || uploading}>
          {loading || uploading ? <Icon icon="Loader" spin /> : null}
          Save product
        </Button>
      </Box>
    </Box>
  )
}

export default ProductEdit
