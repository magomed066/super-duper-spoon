import type { Request } from 'express'

export function normalizeRestaurantPayload(
  body: Request['body']
): Record<string, unknown> {
  return {
    ...body,
    phones: parseOptionalJsonField(body.phones),
    cuisine: parseOptionalJsonField(body.cuisine),
    workSchedule: parseOptionalJsonField(body.workSchedule),
    deliveryTime: parseOptionalNumberField(body.deliveryTime)
  }
}

function parseOptionalJsonField(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value
  }

  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return undefined
  }

  try {
    return JSON.parse(trimmedValue)
  } catch {
    return value
  }
}

function parseOptionalNumberField(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value
  }

  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return undefined
  }

  const parsedValue = Number(trimmedValue)

  return Number.isNaN(parsedValue) ? value : parsedValue
}
