import React, { useEffect, useMemo, useRef, useState } from 'react'

export function useAnchoredMenu(open) {
  const wrapRef = useRef(null)
  const [coords, setCoords] = useState(null)

  useEffect(() => {
    if (!open) return undefined

    const update = () => {
      const node = wrapRef.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const openUp = spaceBelow < 280 && rect.top > spaceBelow
      setCoords({
        top: openUp ? undefined : rect.bottom + 6,
        bottom: openUp ? window.innerHeight - rect.top + 6 : undefined,
        left: Math.max(12, rect.left),
        width: rect.width,
      })
    }

    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open])

  return { wrapRef, coords }
}

export function SearchableMultiSelect({ options, selected, onChange, placeholder, searchPlaceholder }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { wrapRef, coords } = useAnchoredMenu(open)

  useEffect(() => {
    const onDocClick = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [wrapRef])

  const selectedSet = useMemo(() => new Set(selected), [selected])
  const selectedOptions = options.filter((item) => selectedSet.has(item.value))
  const filtered = options.filter((item) =>
    `${item.label} ${item.value}`.toLowerCase().includes(query.trim().toLowerCase()),
  )

  const toggle = (value) => {
    if (selectedSet.has(value)) onChange(selected.filter((item) => item !== value))
    else onChange([...selected, value])
  }

  return (
    <div className="tokri-multiselect" ref={wrapRef}>
      <button type="button" className="tokri-multiselect-control" onClick={() => setOpen((value) => !value)}>
        {selectedOptions.length ? (
          <span className="tokri-multiselect-chips">
            {selectedOptions.map((item) => (
              <span key={item.value} className="tokri-multiselect-chip">
                {item.label}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation()
                    toggle(item.value)
                  }}
                >
                  ×
                </span>
              </span>
            ))}
          </span>
        ) : (
          <span className="tokri-multiselect-placeholder">{placeholder}</span>
        )}
        <span className="tokri-multiselect-caret">{open ? '▴' : '▾'}</span>
      </button>
      {open && coords ? (
        <div
          className="tokri-multiselect-menu"
          style={{
            position: 'fixed',
            top: coords.top,
            bottom: coords.bottom,
            left: coords.left,
            width: Math.max(coords.width, 260),
            zIndex: 1000,
          }}
        >
          <input
            className="tokri-coupon-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            autoFocus
          />
          <div className="tokri-multiselect-list">
            {filtered.length ? (
              filtered.map((item) => {
                const checked = selectedSet.has(item.value)
                return (
                  <label key={item.value} className={`tokri-multiselect-option${checked ? ' is-selected' : ''}`}>
                    <input type="checkbox" checked={checked} onChange={() => toggle(item.value)} />
                    <span>{item.label}</span>
                  </label>
                )
              })
            ) : (
              <div className="tokri-multiselect-empty">No matches</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function FlagCard({ selected, title, hint, onClick }) {
  return (
    <button
      type="button"
      className={`tokri-choice-card${selected ? ' is-selected' : ''}`}
      onClick={onClick}
    >
      <strong>{title}</strong>
      <span>{hint}</span>
    </button>
  )
}
