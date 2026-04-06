import {
  AuthPermission,
  hasPermission,
  useAuthStore
} from '@/entities/auth'
import Sidebar from '@/widgets/sidebar'
import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Outlet } from 'react-router-dom'

function RootLayout() {
  const [opened] = useDisclosure()
  const user = useAuthStore((state) => state.user)
  const hasSidebar =
    hasPermission(user, AuthPermission.VIEW_APPLICATIONS) ||
    hasPermission(user, AuthPermission.VIEW_RESTAURANTS) ||
    hasPermission(user, AuthPermission.VIEW_MENU) ||
    hasPermission(user, AuthPermission.VIEW_ORDERS)

  return (
    <AppShell
      navbar={
        hasSidebar
          ? { width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }
          : undefined
      }
    >
      {hasSidebar ? (
        <AppShell.Navbar>
          <Sidebar />
        </AppShell.Navbar>
      ) : null}
      <AppShell.Main className="bg-moss-50 min-h-screen">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}

export default RootLayout
