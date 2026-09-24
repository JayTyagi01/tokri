import { useEffect, useRef } from 'react'

export default function OtpInput({ value, onChange, length = 4, disabled = false, autoFocus = true }) {
  const digits = String(value || '')
    .replace(/\D/g, '')
    .slice(0, length)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!autoFocus || disabled) return
    inputRef.current?.focus()
  }, [autoFocus, disabled])

  useEffect(() => {
    if (disabled || typeof window === 'undefined' || !('OTPCredential' in window)) return undefined
    if (!navigator.credentials?.get) return undefined

    const controller = new AbortController()
    navigator.credentials
      .get({
        otp: { transport: ['sms'] },
        signal: controller.signal,
      })
      .then((credential) => {
        const code = String(credential?.code || '').replace(/\D/g, '').slice(0, length)
        if (code) onChange(code)
      })
      .catch(() => {})

    return () => controller.abort()
  }, [disabled, length, onChange])

  return (
    <div className="relative mx-auto w-full max-w-xs">
      <div className="pointer-events-none flex justify-center gap-3">
        {Array.from({ length }).map((_, index) => (
          <span
            key={index}
            className={`flex h-14 w-12 items-center justify-center rounded-xl border bg-panel-2 text-xl font-semibold text-white ${
              digits.length === index ? 'border-brand ring-2 ring-brand/30' : 'border-line'
            }`}
          >
            {digits[index] || ''}
          </span>
        ))}
      </div>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        name="one-time-code"
        maxLength={length}
        disabled={disabled}
        value={digits}
        onChange={(event) => onChange(String(event.target.value || '').replace(/\D/g, '').slice(0, length))}
        className="absolute inset-0 z-10 h-full w-full cursor-text bg-transparent text-center text-[2rem] tracking-[1.4em] text-transparent caret-transparent outline-none"
        aria-label="One time code"
      />
    </div>
  )
}
