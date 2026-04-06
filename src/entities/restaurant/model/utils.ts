export const declineMinuteTitle = (number: number | string) => {
  const cases = [2, 0, 1, 1, 1, 2]
  const titles = ['минута', 'минуты', 'минут']

  const mod100 = Number(number) % 100
  const mod10 = Number(number) % 10

  if (mod100 > 10 && mod100 < 20) {
    return `${number} ${titles[2]}`
  }

  return `${number} ${titles[mod10 < 5 ? cases[mod10] : cases[5]]}`
}
