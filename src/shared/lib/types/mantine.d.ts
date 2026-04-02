import type { DefaultMantineColor, MantineColorsTuple } from '@mantine/core'

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<
      DefaultMantineColor | 'aurora' | 'coral' | 'moss',
      MantineColorsTuple
    >
  }
}
