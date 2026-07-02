export function parsePrice(price) {
  const match = String(price).replace(/,/g, '').match(/(\d+(?:\.\d+)?)/)
  return match ? Number(match[1]) : 0
}
