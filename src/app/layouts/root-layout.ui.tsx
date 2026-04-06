import { Outlet } from 'react-router-dom'

function RootLayout() {
  return (
    <main className="flex min-h-screen flex-1 flex-col bg-moss-100 text-moss-900">
      <div className="@container/main flex flex-1 flex-col">
        <div className="flex flex-1 p-4 md:p-6 lg:p-6">
          <Outlet />
        </div>
      </div>
    </main>
  )
}

export default RootLayout
