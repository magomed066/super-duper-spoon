import Sidebar from '@/widgets/sidebar'
import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Outlet } from 'react-router-dom'

function RootLayout() {
  const [opened] = useDisclosure()

  return (
    <AppShell
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
    >
      <AppShell.Navbar>
        <Sidebar />
      </AppShell.Navbar>
      <AppShell.Main className="bg-moss-50 min-h-screen">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}

export default RootLayout
