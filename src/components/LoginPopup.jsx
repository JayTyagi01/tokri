import { useLoginFlow } from '../hooks/useLoginFlow'
import tokriLogo from '../assets/tokri-logo.png'

export default function LoginPopup({ onClose }) {
  const {
    step,
    setStep,
    mobileNumber,
    setMobileNumber,
    otp,
    setOtp,
    loading,
    handleContinue,
    handleLogin,
  } = useLoginFlow({ onSuccess: onClose })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative flex w-full max-w-md flex-col rounded-3xl bg-white p-7 shadow-2xl sm:max-w-lg sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-500 hover:text-slate-900"
        >
          &#10005;
        </button>

        {step === 1 && (
          <div className="flex flex-col">
            <div className="mb-5 flex flex-col items-center gap-3 pt-2">
              <img src={tokriLogo} alt="Tokriii" className="h-14 w-auto object-contain" />
              <p className="text-center text-sm text-slate-600">
                Premium and exotic fruits — handpicked and delivered fresh.
              </p>
              <p className="text-center text-sm text-slate-500">
                Sign in with your mobile number to continue
              </p>
            </div>

            <div className="mb-5 flex items-center rounded-2xl border border-slate-300 bg-slate-50 p-3">
              <span className="text-slate-500">+91</span>
              <input
                type="text"
                placeholder="Enter mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="ml-2 w-full bg-transparent text-slate-900 outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleContinue}
              disabled={loading}
              className="w-full rounded-2xl bg-emerald-950 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Continue'}
            </button>

            <div className="pt-6 text-center text-xs leading-relaxed text-slate-500">
              By continuing, you agree to our{' '}
              <a href="/terms-and-conditions" className="text-slate-900 underline">Terms of service</a> &{' '}
              <a href="/privacy-policy" className="text-slate-900 underline">Privacy policy</a>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="mb-2 text-center text-xl font-bold text-slate-900">Enter OTP</h2>
            <p className="mb-4 text-center text-gray-600">
              We sent a 4-digit code to +91 {mobileNumber}
            </p>
            <div className="mb-4 rounded-2xl border border-slate-300 bg-slate-50 p-3">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full bg-transparent text-center text-lg tracking-[0.4em] text-slate-900 outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full rounded-2xl bg-emerald-950 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
            >
              {loading ? 'Verifying...' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={loading}
              className="mt-3 w-full rounded-2xl border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
