import type { ReactNode } from 'react'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@/app/styles/index.css'
import { appTheme } from '@/shared/lib/theme'

export const withUI = (component: () => ReactNode) => () => {
  return (
    <MantineProvider theme={appTheme}>
      {component()}
      <Notifications position="top-right" />
    </MantineProvider>
  )
}
