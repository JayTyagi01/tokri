import React, { useEffect, useState } from 'react'
import { ApiClient } from 'adminjs'
import { Box, H2, H5, Text, Button, Icon } from '@adminjs/design-system'

const api = new ApiClient()

const statCards = [
  { key: 'productCount', label: 'Products', icon: 'ShoppingCart', resource: 'Product' },
  { key: 'orderCount', label: 'Orders', icon: 'ShoppingBag', resource: 'Order' },
  { key: 'pageCount', label: 'Pages', icon: 'FileText', resource: 'Page' },
  { key: 'reviewCount', label: 'Reviews', icon: 'Star', resource: 'Review' },
]

const adminRoot = () => window.location.pathname.split('/resources')[0] || ''

const Dashboard = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    api.getDashboard().then((res) => setData(res.data)).catch(() => setData({}))
  }, [])

  const stats = data || {}
  const root = adminRoot()

  return (
    <Box variant="grey" className="tokri-dashboard">
      <Box className="tokri-dashboard-hero" p="xxl" mb="xl">
        <H2 mb="sm">Welcome to Tokriii CMS</H2>
        <Text opacity={0.9}>
          Manage your store content, products, orders, and website settings from one place.
        </Text>
      </Box>

      <Box display="grid" className="tokri-stat-grid" mb="xl">
        {statCards.map((card) => (
          <Box key={card.key} className="tokri-stat-card" p="lg">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb="default">
              <H5>{card.label}</H5>
              <Icon icon={card.icon} />
            </Box>
            <Text fontSize={32} fontWeight="bold">
              {stats[card.key] ?? '—'}
            </Text>
            <Button
              mt="default"
              size="sm"
              variant="text"
              as="a"
              href={`/tokri-backoffice/resources/${card.resource}`}
            >
              View all
            </Button>
          </Box>
        ))}
      </Box>

      <Box display="grid" className="tokri-dashboard-grid">
        <Box className="tokri-panel" p="xl">
          <H5 mb="lg">Quick actions</H5>
          <Box display="flex" flexWrap="wrap" className="tokri-quick-actions">
            <Button as="a" href={`${root}/resources/Product/actions/new`} variant="contained">
              Add product
            </Button>
            <Button as="a" href={`${root}/resources/Page/actions/new`} variant="outlined">
              Add page
            </Button>
            <Button as="a" href={`${root}/resources/Setting/records/1/edit`} variant="outlined">
              Store settings
            </Button>
            <Button as="a" href={`${root}/resources/Order`} variant="outlined">
              View orders
            </Button>
          </Box>
        </Box>

        <Box className="tokri-panel" p="xl">
          <H5 mb="lg">Recent orders</H5>
          {(stats.recentOrders || []).length === 0 ? (
            <Text opacity={0.7}>No orders yet.</Text>
          ) : (
            <Box as="table" className="tokri-recent-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.orderNo}>
                    <td>{order.orderNo}</td>
                    <td>{order.status}</td>
                    <td>₹{order.grandTotal}</td>
                  </tr>
                ))}
              </tbody>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default Dashboard
