const apiBaseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL

export const resolveMediaUrl = (value?: string | null): string => {
  if (!value) {
    return ''
  }

  if (/^(?:https?:|blob:|data:)/i.test(value)) {
    return value
  }

  if (!apiBaseUrl) {
    return value
  }

  return new URL(value, apiBaseUrl).toString()
}
