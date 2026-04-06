import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes
} from 'node:crypto'

import { env } from '../../config/index.js'

const SHA256_HEX_LENGTH = 64
const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/i
const ENCRYPTED_VALUE_PREFIX = 'enc:'
const ENCRYPTION_SEPARATOR = '.'
const AES_GCM_ALGORITHM = 'aes-256-gcm'
const AES_GCM_IV_LENGTH = 12
const ENCRYPTION_KEY = createHash('sha256')
  .update(env.dataEncryptionKey)
  .digest()

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

const isEncryptedValue = (value: string): boolean =>
  value.startsWith(ENCRYPTED_VALUE_PREFIX)

const encryptNormalizedValue = (
  value: string,
  normalize: (rawValue: string) => string
): string => {
  if (!value || isEncryptedValue(value)) {
    return value
  }

  const normalizedValue = normalize(value)
  const iv = randomBytes(AES_GCM_IV_LENGTH)
  const cipher = createCipheriv(AES_GCM_ALGORITHM, ENCRYPTION_KEY, iv)
  const encrypted = Buffer.concat([
    cipher.update(normalizedValue, 'utf8'),
    cipher.final()
  ])
  const authTag = cipher.getAuthTag()

  return [
    ENCRYPTED_VALUE_PREFIX,
    iv.toString('base64url'),
    authTag.toString('base64url'),
    encrypted.toString('base64url')
  ].join(ENCRYPTION_SEPARATOR)
}

const decryptValue = (value: string): string => {
  if (!value || !isEncryptedValue(value)) {
    return value
  }

  const [, ivValue, authTagValue, encryptedValue] = value.split(
    ENCRYPTION_SEPARATOR
  )

  if (!ivValue || !authTagValue || !encryptedValue) {
    throw new Error('Encrypted value has invalid format')
  }

  const decipher = createDecipheriv(
    AES_GCM_ALGORITHM,
    ENCRYPTION_KEY,
    Buffer.from(ivValue, 'base64url')
  )

  decipher.setAuthTag(Buffer.from(authTagValue, 'base64url'))

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedValue, 'base64url')),
    decipher.final()
  ]).toString('utf8')
}

export const hashEmail = (email: string): string =>
  hashNormalizedValue(email, (value) => value.trim().toLowerCase())

export const hashPhone = (phone: string): string =>
  hashNormalizedValue(phone, (value) => value.trim())

export const hashAddress = (address: string): string =>
  hashNormalizedValue(address, (value) => value.trim())

export const encryptEmail = (email: string): string =>
  encryptNormalizedValue(email, (value) => value.trim().toLowerCase())

export const encryptPhone = (phone: string): string =>
  encryptNormalizedValue(phone, (value) => value.trim())

export const encryptAddress = (address: string): string =>
  encryptNormalizedValue(address, (value) => value.trim())

export const decryptEmail = (email: string): string => decryptValue(email)

export const decryptPhone = (phone: string): string => decryptValue(phone)

export const decryptAddress = (address: string): string => decryptValue(address)
