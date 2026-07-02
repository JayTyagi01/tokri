import React, { useEffect, useState } from 'react'
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
    id: 'appearance',
    label: 'Appearance',
    fields: [
      'colorPrimary',
      'colorPrimaryLight',
      'colorAccent',
      'colorBackground',
      'colorFooterFrom',
      'colorFooterVia',
      'fontFamily',
    ],
  },
  {
    id: 'homepage',
    label: 'Homepage',
    fields: [
      'homeBannerEnabled',
      'homeCategoriesEnabled',
      'homeBestSellersEnabled',
      'homeBestSellersTitle',
      'homeShopOurRangeEnabled',
      'homeFruitHighlightEnabled',
      'homeImportedFruitsEnabled',
      'homeReviewsEnabled',
    ],
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
      'twilioEnabled',
      'twilioAccountSid',
      'twilioAuthToken',
      'twilioSmsFrom',
      'twilioWhatsappFrom',
    ],
  },
]

const SettingsEdit = (props) => {
  const { record: initialRecord, resource } = props
  const [activeTab, setActiveTab] = useState('general')
  const addNotice = useNotice()
  const { record, handleChange, submit: handleSubmit, loading } = useRecord(
    initialRecord,
    resource.id,
  )

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && TABS.some((tab) => tab.id === hash)) {
      setActiveTab(hash)
    }
  }, [])

  useEffect(() => {
    window.history.replaceState(null, '', `#${activeTab}`)
  }, [activeTab])

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
                Update your store settings and click Save changes below.
              </Text>
              {properties.map((property) => (
                <BasePropertyComponent
                  key={property.propertyPath}
                  where="edit"
                  onChange={handleChange}
                  property={property}
                  resource={resource}
                  record={record}
                />
              ))}
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
