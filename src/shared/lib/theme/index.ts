import { createTheme } from '@mantine/core'
import { auroraColors, coralColors, mossColors } from './colors'

export const appTheme = createTheme({
  primaryColor: 'aurora',
  defaultRadius: 'md',
  fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  colors: {
    aurora: auroraColors,
    coral: coralColors,
    moss: mossColors
  },
  primaryShade: 5,
  headings: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
  }
})
