import { useEffect, useState } from 'react'

export function useMobileKeyboardPad() {
  const [pad, setPad] = useState(0)

  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return undefined

    const sync = () => {
      const covered = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
      setPad(covered)
    }

    sync()
    viewport.addEventListener('resize', sync)
    viewport.addEventListener('scroll', sync)
    return () => {
      viewport.removeEventListener('resize', sync)
      viewport.removeEventListener('scroll', sync)
    }
  }, [])

  return pad
}

export function scrollFieldAboveKeyboard(event) {
  const field = event.currentTarget
  window.setTimeout(() => {
    field?.scrollIntoView?.({ block: 'center', inline: 'nearest', behavior: 'smooth' })
  }, 80)
}
