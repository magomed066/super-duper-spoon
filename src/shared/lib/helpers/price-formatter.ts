export const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  useGrouping: true,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
})
