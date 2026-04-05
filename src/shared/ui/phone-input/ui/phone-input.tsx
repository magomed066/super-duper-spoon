import { TextInput, type TextInputProps } from '@mantine/core'

type PhoneInputProps = Omit<TextInputProps, 'value' | 'onChange'> & {
  value?: string
  onChange?: (value: string) => void
}

const MAX_LOCAL_DIGITS = 10

const getLocalDigits = (value: string) => {
  const digits = value.replace(/\D/g, '')

  if (digits.startsWith('7') || digits.startsWith('8')) {
    return digits.slice(1, MAX_LOCAL_DIGITS + 1)
  }

  return digits.slice(0, MAX_LOCAL_DIGITS)
}

export const formatPhoneNumber = (value: string) => {
  const digits = getLocalDigits(value)

  if (!digits.length) {
    return ''
  }

  const part1 = digits.slice(0, 3)
  const part2 = digits.slice(3, 6)
  const part3 = digits.slice(6, 8)
  const part4 = digits.slice(8, 10)

  let formatted = '+7'

  if (part1) {
    formatted += ` (${part1}`
  }

  if (digits.length >= 4) {
    formatted += ')'
  }

  if (part2) {
    formatted += ` ${part2}`
  }

  if (part3) {
    formatted += `-${part3}`
  }

  if (part4) {
    formatted += `-${part4}`
  }

  return formatted
}

export function PhoneInput({
  value = '',
  onChange,
  placeholder = '+7 (999) 123-45-67',
  ...props
}: PhoneInputProps) {
  return (
    <TextInput
      {...props}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange?.(formatPhoneNumber(event.currentTarget.value))}
    />
  )
}
