import React, { useEffect, useRef, useState } from 'react'
import { ApiClient } from 'adminjs'
import { Box, H2, H5, Text } from '@adminjs/design-system'
import { LocalSelect } from './form-controls'

const api = new ApiClient()
const RANGES = [
  { value: '7d', label: '7 days' },
  { value: 'thisMonth', label: 'This month' },
  { value: 'lastMonth', label: 'Last month' },
  { value: '90d', label: '3 months' },
]
const WIDGETS = ['orderValue', 'orders', 'customers', 'products']

const inr = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

function RangeSelect({ value, onChange }) {
  return (
    <div className="tokri-range-select">
      <LocalSelect value={value} options={RANGES} onChange={onChange} />
    </div>
  )
}

function axisMax(value) {
  if (value <= 0) return 1000
  const padded = value * 1.1
  const magnitude = 10 ** Math.floor(Math.log10(padded))
  const normalized = padded / magnitude
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10
  return nice * magnitude
}

function LineChart({ series }) {
  const [hover, setHover] = useState(null)
  const width = 1200
  const height = 320
  const padLeft = 86
  const padRight = 18
  const padTop = 18
  const padBottom = 36
  const max = axisMax(Math.max(...series.map((point) => point.orderValue), 0))
  const plotWidth = width - padLeft - padRight
  const plotHeight = height - padTop - padBottom
  const baseline = padTop + plotHeight
  const yFor = (value) => baseline - (value / max) * plotHeight
  const step = series.length > 1 ? plotWidth / (series.length - 1) : plotWidth
  const coords = series.map((point, index) => {
    const x = series.length === 1 ? padLeft + plotWidth / 2 : padLeft + index * step
    return { x, y: yFor(point.orderValue), point }
  })
  const line = coords.map((item, index) => `${index ? 'L' : 'M'}${item.x},${item.y}`).join(' ')
  const area = coords.length
    ? `${line} L${coords[coords.length - 1].x},${baseline} L${coords[0].x},${baseline} Z`
    : ''
  const labelEvery = series.length > 20 ? Math.ceil(series.length / 8) : series.length > 10 ? 4 : 1
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    value: Math.round(max * ratio),
    y: yFor(max * ratio),
  }))

  return (
    <div className="tokri-chart-plot" onMouseLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="tokri-chart" role="img">
        {ticks.map((tick) => (
          <g key={tick.value}>
            <line x1={padLeft} x2={width - padRight} y1={tick.y} y2={tick.y} className="tokri-chart-gridline" />
            <text x={padLeft - 10} y={tick.y + 4} textAnchor="end" className="tokri-chart-axis">
              {inr(tick.value)}
            </text>
          </g>
        ))}
        <path d={area} fill="#047857" opacity="0.16" />
        <path d={line} fill="none" stroke="#047857" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        {coords.map((item) => (
          <g key={item.point.date}>
            <circle
              cx={item.x}
              cy={item.y}
              r="14"
              fill="transparent"
              onMouseEnter={() => setHover(item)}
            />
            <circle cx={item.x} cy={item.y} r="4.5" fill="#fff" stroke="#047857" strokeWidth="2" pointerEvents="none" />
          </g>
        ))}
        {coords.map((item, index) =>
          index % labelEvery === 0 ? (
            <text key={`${item.point.date}-label`} x={item.x} y={height - 8} textAnchor="middle" className="tokri-chart-label">
              {item.point.label}
            </text>
          ) : null,
        )}
      </svg>
      {hover ? (
        <div
          className={`tokri-chart-tip${hover.y < 90 ? ' is-below' : ''}`}
          style={{ left: `${(hover.x / width) * 100}%`, top: `${(hover.y / height) * 100}%` }}
        >
          <span>{hover.point.label}</span>
          <strong>{inr(hover.point.orderValue)}</strong>
        </div>
      ) : null}
    </div>
  )
}

function Pager({ page, pageSize, total, onChange }) {
  const pages = Math.max(1, Math.ceil((total || 0) / pageSize))
  if (pages <= 1) return null
  const numbers = []
  for (let number = 1; number <= pages; number += 1) numbers.push(number)
  return (
    <div className="tokri-widget-pages">
      <div className="tokri-list-pagination-pages">
        <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Prev
        </button>
        {numbers.map((number) => (
          <button
            type="button"
            key={number}
            className={number === page ? 'is-current' : ''}
            onClick={() => onChange(number)}
          >
            {number}
          </button>
        ))}
        <button type="button" disabled={page >= pages} onClick={() => onChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const requests = useRef({})
  const [ranges, setRanges] = useState({
    orderValue: '7d',
    orders: '7d',
    customers: '7d',
    products: '7d',
  })
  const [data, setData] = useState({})
  const [pages, setPages] = useState({ orders: 1, customers: 1 })
  const [busy, setBusy] = useState({
    orderValue: true,
    orders: true,
    customers: true,
    products: true,
  })

  const loadWidget = (widget, range, page = 1) => {
    const ticket = (requests.current[widget] || 0) + 1
    requests.current[widget] = ticket
    setBusy((current) => ({ ...current, [widget]: true }))
    api
      .getDashboard({ params: { widget, range, page } })
      .then((response) => {
        if (requests.current[widget] !== ticket) return
        setData((current) => ({ ...current, ...response.data }))
      })
      .finally(() => {
        if (requests.current[widget] !== ticket) return
        setBusy((current) => ({ ...current, [widget]: false }))
      })
  }

  useEffect(() => {
    WIDGETS.forEach((widget) => loadWidget(widget, '7d'))
  }, [])

  const changeRange = (widget, range) => {
    setRanges((current) => ({ ...current, [widget]: range }))
    if (widget === 'orders' || widget === 'customers') {
      setPages((current) => ({ ...current, [widget]: 1 }))
    }
    loadWidget(widget, range, 1)
  }

  const changePage = (widget, page) => {
    setPages((current) => ({ ...current, [widget]: page }))
    loadWidget(widget, ranges[widget], page)
  }

  const orderValue = data.orderValue
  const orders = data.orders
  const customers = data.customers
  const products = data.products

  return (
    <Box variant="transparent" className="tokri-analytics">
      <div className="tokri-analytics-head">
        <H2 mb="sm">Dashboard</H2>
      </div>

      <section className="tokri-chart-card tokri-chart-card-wide">
        <div className="tokri-widget-head">
          <div>
            <H5 mb="sm">Order Value</H5>
            <Text opacity={0.7}>
              {busy.orderValue && !orderValue
                ? 'Loading…'
                : `${inr(orderValue?.total)} from ${orderValue?.orderCount || 0} orders`}
            </Text>
          </div>
          <RangeSelect value={ranges.orderValue} onChange={(value) => changeRange('orderValue', value)} />
        </div>
        {orderValue?.series?.length ? (
          <div className="tokri-chart-frame">
            <LineChart series={orderValue.series} />
          </div>
        ) : null}
      </section>

      <div className="tokri-split">
        <section className="tokri-chart-card">
          <div className="tokri-widget-head">
            <div>
              <H5 mb="sm">Order Amount</H5>
              <Text opacity={0.7}>
                {busy.orders && !orders ? 'Loading…' : `${orders?.total || 0} orders`}
              </Text>
            </div>
            <RangeSelect value={ranges.orders} onChange={(value) => changeRange('orders', value)} />
          </div>
          {orders?.rows?.length ? (
            <div className="tokri-table-wrap">
              <table className="tokri-data-table">
                <thead>
                  <tr>
                    <th>Order number</th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Placed</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.rows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.orderNo}</td>
                      <td>{row.name}</td>
                      <td>{inr(row.amount)}</td>
                      <td>{row.placedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Text opacity={0.7}>{busy.orders ? 'Loading…' : 'No orders in this period.'}</Text>
          )}
          <Pager
            page={orders?.page || pages.orders}
            pageSize={orders?.pageSize || 10}
            total={orders?.total || 0}
            onChange={(page) => changePage('orders', page)}
          />
        </section>

        <section className="tokri-chart-card">
          <div className="tokri-widget-head">
            <div>
              <H5 mb="sm">New Customers</H5>
              <Text opacity={0.7}>
                {busy.customers && !customers ? 'Loading…' : `${customers?.total || 0} people registered`}
              </Text>
            </div>
            <RangeSelect value={ranges.customers} onChange={(value) => changeRange('customers', value)} />
          </div>
          {customers?.rows?.length ? (
            <div className="tokri-table-wrap">
              <table className="tokri-data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Date of birth</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.rows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.name}</td>
                      <td>+91 {row.phone}</td>
                      <td>{row.dateOfBirth}</td>
                      <td>{row.registeredAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Text opacity={0.7}>{busy.customers ? 'Loading…' : 'No new customers in this period.'}</Text>
          )}
          <Pager
            page={customers?.page || pages.customers}
            pageSize={customers?.pageSize || 10}
            total={customers?.total || 0}
            onChange={(page) => changePage('customers', page)}
          />
        </section>
      </div>

      <div className="tokri-split">
        <section className="tokri-chart-card">
          <div className="tokri-widget-head">
            <div>
              <H5 mb="sm">Best Selling Products</H5>
              <Text opacity={0.7}>
                {busy.products && !products ? 'Loading…' : 'Top 5 by number of orders'}
              </Text>
            </div>
            <RangeSelect value={ranges.products} onChange={(value) => changeRange('products', value)} />
          </div>
          {products?.rows?.length ? (
            <div className="tokri-table-wrap">
              <table className="tokri-data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Orders</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {products.rows.map((row) => (
                    <tr key={row.name}>
                      <td>{row.name}</td>
                      <td>{row.orders}</td>
                      <td>{inr(row.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Text opacity={0.7}>{busy.products ? 'Loading…' : 'No products sold in this period.'}</Text>
          )}
        </section>
      </div>
    </Box>
  )
}

export default Dashboard
