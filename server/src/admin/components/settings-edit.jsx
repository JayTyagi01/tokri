import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Box,
  Button,
  DrawerContent,
  DrawerFooter,
  H4,
  Icon,
  Text,
} from '@adminjs/design-system'
import { BasePropertyComponent, useRecord, useNotice } from 'adminjs'
import { SearchableMultiSelect } from './form-controls.jsx'

const TABS = [
  {
    id: 'general',
    label: 'General',
    fields: [
      'storeName',
      'storeTagline',
      'storeEmail',
      'storePhone1',
      'storePhone2',
      'storeAddress',
      'promoBanner',
      'earlyDelivery',
    ],
  },
  {
    id: 'charges',
    label: 'Charges',
    fields: ['shippingFee', 'handlingFee'],
  },
  {
    id: 'homepage',
    label: 'Homepage',
    fields: ['homeBannerImage', 'homeHighlightImage', 'homeFeaturedCategorySlugs'],
  },
  {
    id: 'payments',
    label: 'Payments',
    fields: ['razorpayEnabled', 'razorpayKeyId', 'razorpayKeySecret'],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    fields: [
      'msg91Enabled',
      'msg91AuthKey',
      'msg91SenderId',
      'msg91OtpTemplateId',
      'msg91OrderTemplateId',
      'msg91WhatsappEnabled',
      'msg91WhatsappNumber',
      'msg91WhatsappOtpTemplate',
      'msg91WhatsappOrderTemplate',
      'msg91WhatsappLanguage',
      'msg91WhatsappNamespace',
      'msg91WhatsappOtpButton',
    ],
  },
]

const withoutTrailingSlash = (value) => String(value || '').replace(/\/+$/, '')

function parseSlugs(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw.map((item) => String(item).trim()).filter(Boolean)
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parseSlugs(parsed)
    } catch {
      // ignore
    }
    return raw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

function resolveImageUrl(path, appUrl) {
  if (!path) return ''
  if (/^(https?:|data:|blob:)/.test(path)) return path
  return `${withoutTrailingSlash(appUrl || window.location.origin)}${path}`
}

function ImageUploader({
  label,
  hint,
  value,
  previewUrl,
  uploading,
  fileRef,
  onUpload,
  wide,
}) {
  const displayed = previewUrl || value

  return (
    <label className="tokri-coupon-label">
      {label}
      <span className={`tokri-upload-drop${wide ? ' tokri-upload-drop-wide' : ''}`}>
        {displayed ? (
          <img src={displayed} alt={`${label} preview`} />
        ) : (
          <span>{uploading ? 'Uploading…' : 'Click to upload an image'}</span>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} />
      </span>
      <span className="tokri-field-hint">{hint}</span>
    </label>
  )
}

const SettingsEdit = (props) => {
  const { record: initialRecord, resource } = props
  const [activeTab, setActiveTab] = useState('general')
  const addNotice = useNotice()
  const { record, handleChange, submit: handleSubmit, loading } = useRecord(
    initialRecord,
    resource.id,
  )
  const bannerFileRef = useRef(null)
  const highlightFileRef = useRef(null)
  const [bannerPreview, setBannerPreview] = useState('')
  const [highlightPreview, setHighlightPreview] = useState('')
  const [bannerUploading, setBannerUploading] = useState(false)
  const [highlightUploading, setHighlightUploading] = useState(false)
  const [categories, setCategories] = useState([])

  const params = record?.params || {}
  const custom = resource?.options?.custom || {}
  const apiBaseUrl = withoutTrailingSlash(custom.apiBaseUrl || '/api/v1')
  const appUrl = custom.appUrl || window.location.origin
  const selectedCategorySlugs = parseSlugs(params.homeFeaturedCategorySlugs)

  const bannerImageUrl = useMemo(
    () => resolveImageUrl(params.homeBannerImage, appUrl),
    [appUrl, params.homeBannerImage],
  )
  const highlightImageUrl = useMemo(
    () => resolveImageUrl(params.homeHighlightImage, appUrl),
    [appUrl, params.homeHighlightImage],
  )

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash === 'appearance') {
      setActiveTab('charges')
      return
    }
    if (hash && TABS.some((tab) => tab.id === hash)) {
      setActiveTab(hash)
    }
  }, [])

  useEffect(() => {
    window.history.replaceState(null, '', `#${activeTab}`)
  }, [activeTab])

  useEffect(() => {
    return () => {
      if (bannerPreview?.startsWith('blob:')) URL.revokeObjectURL(bannerPreview)
    }
  }, [bannerPreview])

  useEffect(() => {
    return () => {
      if (highlightPreview?.startsWith('blob:')) URL.revokeObjectURL(highlightPreview)
    }
  }, [highlightPreview])

  useEffect(() => {
    let ignore = false
    fetch(`${apiBaseUrl}/categories`)
      .then((response) => response.json())
      .then((data) => {
        if (!ignore) setCategories(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (!ignore) setCategories([])
      })
    return () => {
      ignore = true
    }
  }, [apiBaseUrl])

  const uploadImage = async (event, field, setPreview, setBusy, fileRef, successMessage) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('folder', 'general')
    formData.append('file', file)
    const localPreviewUrl = URL.createObjectURL(file)
    setPreview(localPreviewUrl)
    setBusy(true)

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
      handleChange(field, media.path)
      setPreview(resolveImageUrl(media.path, appUrl))
      addNotice({ message: successMessage, type: 'success' })
    } catch (error) {
      addNotice({ message: error.message || 'Could not upload image', type: 'error' })
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const submit = (event) => {
    event.preventDefault()

    handleSubmit()
      .then((response) => {
        const notice = response?.data?.notice
        if (notice?.type === 'success' || response?.data?.record) {
          addNotice({
            message: 'Settings saved successfully',
            type: 'success',
          })
        } else if (notice?.type === 'error') {
          addNotice({
            message: notice.message || 'Could not save settings',
            type: 'error',
          })
        }
      })
      .catch(() => {
        addNotice({
          message: 'Could not save settings. Please try again.',
          type: 'error',
        })
      })

    return false
  }

  return (
    <Box as="form" onSubmit={submit} flex flexDirection="column" className="tokri-settings-form">
      <Box className="tokri-settings-tabs" mb="xl">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tokri-settings-tab${activeTab === tab.id ? ' is-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </Box>

      <DrawerContent>
        {TABS.map((tab) => {
          const properties = resource.editProperties.filter((property) =>
            tab.fields.includes(property.propertyPath),
          )

          return (
            <Box
              key={tab.id}
              className="tokri-settings-panel"
              p="xl"
              style={{ display: activeTab === tab.id ? 'block' : 'none' }}
            >
              <H4 mb="sm">{tab.label}</H4>
              <Text mb="xl" opacity={0.75}>
                {tab.id === 'charges'
                  ? 'Shipping fee and handling charge are added to every order on the website and the app.'
                  : tab.id === 'homepage'
                    ? 'These images and categories appear on the website homepage. Click Save changes after uploading.'
                    : 'Update your store settings and click Save changes below.'}
              </Text>
              {tab.id === 'charges' ? (
                <div className="tokri-charges-fields">
                  <label className="tokri-coupon-label">
                    Shipping fee (₹)
                    <input
                      className="tokri-coupon-input"
                      type="number"
                      min="0"
                      step="0.01"
                      value={record?.params?.shippingFee ?? ''}
                      onChange={(event) => handleChange('shippingFee', event.target.value)}
                    />
                    <span className="tokri-field-hint">Delivery charge added to every order</span>
                  </label>
                  <label className="tokri-coupon-label">
                    Handling charge (₹)
                    <input
                      className="tokri-coupon-input"
                      type="number"
                      min="0"
                      step="0.01"
                      value={record?.params?.handlingFee ?? ''}
                      onChange={(event) => handleChange('handlingFee', event.target.value)}
                    />
                    <span className="tokri-field-hint">Cart handling fee added to every order</span>
                  </label>
                </div>
              ) : tab.id === 'homepage' ? (
                <div className="tokri-homepage-fields">
                  <ImageUploader
                    label="Home banner image"
                    hint="Shown as the website hero banner. JPG, PNG, GIF, or WebP up to 5MB."
                    value={bannerImageUrl}
                    previewUrl={bannerPreview}
                    uploading={bannerUploading}
                    fileRef={bannerFileRef}
                    wide
                    onUpload={(event) =>
                      uploadImage(
                        event,
                        'homeBannerImage',
                        setBannerPreview,
                        setBannerUploading,
                        bannerFileRef,
                        'Banner image uploaded',
                      )
                    }
                  />
                  <ImageUploader
                    label="Fruit highlight image"
                    hint="Replaces the kiwi image in “The Small Fruit with a Big Punch” on the website."
                    value={highlightImageUrl}
                    previewUrl={highlightPreview}
                    uploading={highlightUploading}
                    fileRef={highlightFileRef}
                    onUpload={(event) =>
                      uploadImage(
                        event,
                        'homeHighlightImage',
                        setHighlightPreview,
                        setHighlightUploading,
                        highlightFileRef,
                        'Highlight image uploaded',
                      )
                    }
                  />
                  <label className="tokri-coupon-label">
                    Homepage categories
                    <SearchableMultiSelect
                      options={categories.map((item) => ({
                        value: item.slug,
                        label: item.label || item.title || item.slug,
                      }))}
                      selected={selectedCategorySlugs}
                      onChange={(slugs) =>
                        handleChange('homeFeaturedCategorySlugs', JSON.stringify(slugs))
                      }
                      placeholder="Search and select categories"
                      searchPlaceholder="Search categories"
                    />
                    <span className="tokri-field-hint">
                      These categories load on the website after the fruit highlight section, one at
                      a time as the visitor scrolls.
                    </span>
                  </label>
                </div>
              ) : (
                properties.map((property) => (
                  <BasePropertyComponent
                    key={property.propertyPath}
                    where="edit"
                    onChange={handleChange}
                    property={property}
                    resource={resource}
                    record={record}
                  />
                ))
              )}
            </Box>
          )
        })}
      </DrawerContent>

      <DrawerFooter>
        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? <Icon icon="Loader" spin /> : null}
          Save changes
        </Button>
      </DrawerFooter>
    </Box>
  )
}

export default SettingsEdit
