import type { ReactNode } from 'react'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import '@/app/styles/index.css'
import { appTheme } from '@/shared/lib/theme'

export const withUI = (component: () => ReactNode) => () => {
  return <MantineProvider theme={appTheme}>{component()}</MantineProvider>
}
