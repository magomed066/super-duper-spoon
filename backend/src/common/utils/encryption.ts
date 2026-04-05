import { createHash } from 'node:crypto'

const SHA256_HEX_LENGTH = 64
const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/i

const hashValue = (value: string): string =>
  createHash('sha256').update(value).digest('hex')

const hashNormalizedValue = (
  value: string,
  normalize: (rawValue: string) => string
): string => {
  if (!value) {
    return value
  }

  if (
    value.length === SHA256_HEX_LENGTH &&
    SHA256_HEX_PATTERN.test(value)
  ) {
    return value.toLowerCase()
  }

  return hashValue(normalize(value))
}

export const hashEmail = (email: string): string =>
  hashNormalizedValue(email, (value) => value.trim().toLowerCase())

export const hashPhone = (phone: string): string =>
  hashNormalizedValue(phone, (value) => value.trim())

export const hashAddress = (address: string): string =>
  hashNormalizedValue(address, (value) => value.trim())
