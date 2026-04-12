import React, { useState } from 'react'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

export default function LoginPopup({ onClose }) {
  const [step, setStep] = useState(1)
  const [mobileNumber, setMobileNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [sentOtp, setSentOtp] = useState('')

  const validateMobile = () => /^\d{10}$/.test(mobileNumber)

  const handleContinue = () => {
    if (!validateMobile()) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid number',
        text: 'Please enter a valid 10-digit mobile number.',
        confirmButtonColor: '#3085d6',
      })
      return
    }

    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString()
    setSentOtp(generatedOtp)
    setOtp('')
    setStep(2)

    Swal.fire({
      icon: 'success',
      title: 'OTP Sent',
      text: `An OTP has been sent to +91 ${mobileNumber}.`,
      confirmButtonColor: '#3085d6',
    })

    console.log('Mock OTP for demo:', generatedOtp)
  }

  const handleLogin = () => {
    if (!/^\d{4}$/.test(otp)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid OTP',
        text: 'Please enter the 4-digit OTP.',
        confirmButtonColor: '#3085d6',
      })
      return
    }

    if (otp !== sentOtp) {
      Swal.fire({
        icon: 'error',
        title: 'OTP Incorrect',
        text: 'The entered OTP does not match. Please try again.',
        confirmButtonColor: '#3085d6',
      })
      return
    }

    Swal.fire({
      icon: 'success',
      title: 'Login Successful',
      text: 'You have successfully logged in!',
      confirmButtonColor: '#3085d6',
    }).then(() => {
      onClose()
      setStep(1)
      setMobileNumber('')
      setOtp('')
      setSentOtp('')
    })
  }

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 w-96 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-500 hover:text-slate-900"
        >
          &#10005;
        </button>

        {step === 1 && (
          <div>
            <div className="mb-4 flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-300 text-2xl font-black text-emerald-950">
                B
              </div>
              <h2 className="text-xl font-bold text-center">India's last minute app</h2>
              <p className="text-center text-gray-600">Log in or Sign up</p>
            </div>

            <div className="flex items-center rounded-2xl border border-slate-300 bg-slate-50 p-3 mb-4">
              <span className="text-slate-500">+91</span>
              <input
                type="text"
                placeholder="Enter mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="ml-2 w-full bg-transparent text-slate-900 outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleContinue}
              className="w-full rounded-2xl bg-slate-700 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Continue
            </button>
            <p className="text-xs text-center text-slate-500 mt-4">
              By continuing, you agree to our{' '}
              <a href="#" className="text-slate-900 underline">Terms of service</a> &{' '}
              <a href="#" className="text-slate-900 underline">Privacy policy</a>
            </p>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-center mb-2">Enter OTP</h2>
            <p className="text-center text-gray-600 mb-4">We have sent an OTP to your mobile number</p>
            <div className="rounded-2xl border border-slate-300 bg-slate-50 p-3 mb-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-transparent text-slate-900 outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleLogin}
              className="w-full rounded-2xl bg-slate-700 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="mt-3 w-full rounded-2xl border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
