import { Links, Meta, Scripts, ScrollRestoration } from 'react-router'
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps
} from '@mantine/core'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ColorSchemeScript />
        <Meta />
        <Links />
      </head>
      <body>
        <MantineProvider>{children}</MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

// ... other app/root.tsx content
