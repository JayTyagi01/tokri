import React, { useMemo, useState } from 'react'
import { Box, Button, H4, H5, Label, Select, Text } from '@adminjs/design-system'
import { useNotice, useRecord } from 'adminjs'

const formatMoney = (value) => {
  const amount = Number(value)
  if (Number.isNaN(amount)) return '₹0'
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
}

const formatDateTime = (value) => {
  if (!value) return '—'
  return new Date(value).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

const resolveImage = (value) => {
  if (!value) return ''
  if (/^(https?:|data:|blob:)/.test(value)) return value
  if (value.startsWith('/')) return `${window.location.origin.replace(/:\d+$/, ':5000')}${value}`
  return value
}

const OrderDetail = (props) => {
  const { record: initialRecord, resource, action } = props
  const isEdit = action?.name === 'edit'
  const addNotice = useNotice()
  const { record, handleChange, submit, loading } = useRecord(initialRecord, resource.id)
  const params = record?.params || {}
  const [saving, setSaving] = useState(false)

  const items = useMemo(() => {
    try {
      const parsed = JSON.parse(params.itemsJson || '[]')
      return parsed.map((item) => ({
        ...item,
        image: resolveImage(item.image),
      }))
    } catch {
      return []
    }
  }, [params.itemsJson])

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await submit()
      addNotice({ message: 'Order updated successfully.', type: 'success' })
    } catch (error) {
      addNotice({ message: error.message || 'Could not update order.', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'packed', label: 'Packed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  const paymentOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
  ]

  return (
    <Box variant="grey" className="tokri-order-detail">
      <Box className="tokri-panel" p="xl" mb="xl">
        <H4 mb="sm">
          Order #{params.orderNo} details
        </H4>
        <Text opacity={0.8}>
          Payment via {params.paymentMethod || 'Cash on delivery'}
          {params.razorpayPaymentId ? ` · Payment ID: ${params.razorpayPaymentId}` : ''}
        </Text>
      </Box>

      <Box display="grid" className="tokri-order-grid" mb="xl">
        <Box className="tokri-panel" p="lg">
          <H5 mb="lg">General</H5>
          <Box mb="default">
            <Label>Order date</Label>
            <Text>{formatDateTime(params.createdAt)}</Text>
          </Box>
          <Box mb="default">
            <Label>Customer name</Label>
            <Text fontWeight="bold">{params.customerName || 'Guest'}</Text>
          </Box>
          <Box mb="default">
            <Label>Customer phone</Label>
            <Text>{params.customerPhone || '—'}</Text>
          </Box>
          {params.customerEmail ? (
            <Box mb="default">
              <Label>Customer email</Label>
              <Text>{params.customerEmail}</Text>
            </Box>
          ) : null}
          {isEdit ? (
            <form onSubmit={handleSave}>
              <Box mb="default">
                <Label>Order status</Label>
                <Select
                  value={statusOptions.find((option) => option.value === params.status)}
                  options={statusOptions}
                  onChange={(selected) => handleChange('status', selected?.value)}
                />
              </Box>
              <Box mb="lg">
                <Label>Payment status</Label>
                <Select
                  value={paymentOptions.find((option) => option.value === params.paymentStatus)}
                  options={paymentOptions}
                  onChange={(selected) => handleChange('paymentStatus', selected?.value)}
                />
              </Box>
              <Button variant="contained" type="submit" disabled={loading || saving}>
                {saving ? 'Saving...' : 'Update order'}
              </Button>
            </form>
          ) : (
            <>
              <Box mb="default">
                <Label>Order status</Label>
                <Text textTransform="capitalize">{params.status}</Text>
              </Box>
              <Box mb="default">
                <Label>Payment status</Label>
                <Text textTransform="capitalize">{params.paymentStatus}</Text>
              </Box>
            </>
          )}
        </Box>

        <Box className="tokri-panel" p="lg">
          <H5 mb="lg">Delivery address</H5>
          {params.addressFormatted ? (
            <>
              <Box mb="default">
                <Label>Address type</Label>
                <Text>{params.addressLabel || 'Delivery'}</Text>
              </Box>
              <Box mb="default">
                <Label>Deliver to</Label>
                <Text>{params.customerName}</Text>
              </Box>
              <Box mb="default">
                <Label>Phone</Label>
                <Text>{params.customerPhone || '—'}</Text>
              </Box>
              <Box>
                <Label>Full address</Label>
                <Text style={{ lineHeight: 1.7 }}>{params.addressFormatted}</Text>
              </Box>
            </>
          ) : (
            <Text opacity={0.7}>No delivery address saved for this order.</Text>
          )}
        </Box>
      </Box>

      <Box className="tokri-panel" p="lg">
        <H5 mb="lg">Order items</H5>
        {items.length === 0 ? (
          <Text opacity={0.7}>No items found for this order.</Text>
        ) : (
          <Box as="table" className="tokri-order-items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Cost</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Box display="flex" alignItems="center" style={{ gap: 12 }}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="tokri-order-item-image" />
                      ) : null}
                      <Box>
                        <Text fontWeight="bold">{item.name}</Text>
                        {item.weight ? <Text fontSize="sm" opacity={0.7}>{item.weight}</Text> : null}
                      </Box>
                    </Box>
                  </td>
                  <td>{formatMoney(item.priceValue)}</td>
                  <td>{item.quantity}</td>
                  <td>{formatMoney(item.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}>Items subtotal</td>
                <td>{formatMoney(params.itemsTotal)}</td>
              </tr>
              <tr>
                <td colSpan={3}>Delivery charges</td>
                <td>{formatMoney(params.deliveryCharge)}</td>
              </tr>
              <tr>
                <td colSpan={3}>Cart handling</td>
                <td>{formatMoney(params.handlingCharge)}</td>
              </tr>
              <tr>
                <td colSpan={3}>Small cart charge</td>
                <td>{formatMoney(params.smallCartCharge)}</td>
              </tr>
              {Number(params.discount) > 0 ? (
                <tr>
                  <td colSpan={3}>Discount</td>
                  <td>-{formatMoney(params.discount)}</td>
                </tr>
              ) : null}
              <tr className="is-total">
                <td colSpan={3}>Order total</td>
                <td>{formatMoney(params.grandTotal)}</td>
              </tr>
            </tfoot>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default OrderDetail
