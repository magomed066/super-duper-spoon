import { Route, Routes } from 'react-router-dom'
import { RequireAuth } from '@/app/providers/require-auth'
import { RequireGuest } from '@/app/providers/require-guest'
import { privateRoutes, publicRoutes } from './routes'
import { ROUTES } from '@/shared/config/routes'

const Routing = () => {
  return (
    <Routes>
      {privateRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <RequireAuth>
              <Component />
            </RequireAuth>
          }
        />
      ))}

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
