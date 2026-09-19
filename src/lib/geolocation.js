import { fetchJson } from './api'

export async function fetchAddressFromBrowser() {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    throw new Error('Location is not supported in this browser.')
  }

  const coords = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => {
        if (error?.code === 1) {
          reject(new Error('Allow location access to auto-fill your delivery address.'))
          return
        }
        reject(new Error('Could not detect your location. Please enter it manually.'))
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
    )
  })

  const data = await fetchJson(
    `/geo/reverse?lat=${encodeURIComponent(coords.latitude)}&lng=${encodeURIComponent(coords.longitude)}`,
  )
  if (!data?.address) {
    throw new Error('Could not read an address from this location.')
  }
  return data.address
}
