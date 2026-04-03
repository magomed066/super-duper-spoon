import { Route, Routes } from 'react-router-dom'
import { RequireAuth } from '@/app/providers/require-auth'
import { RequireGuest } from '@/app/providers/require-guest'
import { privateRoutes, publicRoutes } from './routes'
import { ROUTES } from '@/shared/config/routes'
import RootLayout from '@/app/layouts'

const Routing = () => {
  return (
    <Routes>
      <Route
        element={
          <RequireAuth>
            <RootLayout />
          </RequireAuth>
        }
      >
        {privateRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Route>

      {publicRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            path === ROUTES.AUTH ? (
              <RequireGuest>
                <Component />
              </RequireGuest>
            ) : (
              <Component />
            )
          }
        />
      ))}
    </Routes>
  )
}

export default Routing
