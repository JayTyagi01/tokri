import React, { useState } from 'react'

function copyText(value) {
  if (!value || !navigator.clipboard?.writeText) return Promise.reject()
  return navigator.clipboard.writeText(value)
}

export default function RazorpayPaymentId({ record }) {
  const paymentId = String(record?.params?.razorpayPaymentId || '').trim()
  const paid = record?.params?.paymentStatus === 'paid'
  const [copied, setCopied] = useState(false)

  if (!paid || !paymentId) {
    return <span className="tokri-rzp-empty">—</span>
  }

  const handleCopy = (event) => {
    event.preventDefault()
    event.stopPropagation()
    copyText(paymentId)
      .then(() => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1200)
      })
      .catch(() => {})
  }

  return (
    <div className="tokri-rzp-cell" onClick={(event) => event.stopPropagation()}>
      <a
        className="tokri-rzp-id"
        href={`https://dashboard.razorpay.com/app/payments/${encodeURIComponent(paymentId)}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Open this payment in Razorpay"
      >
        {paymentId}
      </a>
      <button type="button" className="tokri-rzp-copy" onClick={handleCopy}>
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}
