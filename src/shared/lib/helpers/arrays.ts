import type { ComboboxItem } from '@mantine/core'

export const mapSelectData = <
  T extends Record<K1, string | number> & Record<K2, string>,
  K1 extends keyof T,
  K2 extends keyof T
>(
  items: T[] = [],
  valueKey: K1,
  labelKey: K2
): ComboboxItem[] => {
  if (items == null || items.length === 0) {
    return []
  }

  return items.map((item) => ({
    value: item[valueKey] as string,
    label: item[labelKey] as string
  }))
}
