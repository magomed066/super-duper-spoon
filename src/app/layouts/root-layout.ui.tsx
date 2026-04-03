import { Outlet } from 'react-router-dom'

function RootLayout() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="p-4 md:p-6 lg:p-6">
          <Outlet />
        </div>
      </div>
    </main>
  )
}

export default RootLayout
