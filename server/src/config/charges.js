export const DELIVERY_CHARGE = 25
export const HANDLING_CHARGE = 2
export const SMALL_CART_CHARGE = 20

export function calcCartTotals(items) {
  const itemsTotal = items.reduce((sum, item) => sum + item.priceValue * item.quantity, 0)
  const hasItems = items.length > 0
  const deliveryCharge = hasItems ? DELIVERY_CHARGE : 0
  const handlingCharge = hasItems ? HANDLING_CHARGE : 0
  const smallCartCharge = hasItems ? SMALL_CART_CHARGE : 0
  const grandTotal = itemsTotal + deliveryCharge + handlingCharge + smallCartCharge

  return {
    itemsTotal,
    deliveryCharge,
    handlingCharge,
    smallCartCharge,
    grandTotal,
    totalCount: items.reduce((sum, item) => sum + item.quantity, 0),
  }
}
