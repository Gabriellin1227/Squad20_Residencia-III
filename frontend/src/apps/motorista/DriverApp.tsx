import { RequireAuth } from '@/components/RequireAuth/RequireAuth'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LoginPage } from '@/pages/auth/LoginPage'
import { NotFoundPage } from '@/pages/placeholder/NotFoundPage'
import { DriverLayout } from './layouts/DriverLayout'
import { DriverChecklistPage } from './pages/DriverChecklistPage'
import { DriverFuelPage } from './pages/DriverFuelPage'
import { DriverHomePage } from './pages/DriverHomePage'
import { DriverProfilePage } from './pages/DriverProfilePage'
import { DriverTripsPage } from './pages/DriverTripsPage'

/** Rotas do app do motorista (servido na raiz do próprio domínio/porta). */
export function DriverRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage redirectTo="/" />} />
      <Route element={<RequireAuth />}>
        <Route element={<DriverLayout />}>
          <Route index element={<DriverHomePage />} />
          <Route path="viagens" element={<DriverTripsPage />} />
          <Route path="checklist" element={<DriverChecklistPage />} />
          <Route path="abastecimento" element={<DriverFuelPage />} />
          <Route path="perfil" element={<DriverProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export function DriverApp() {
  return (
    <BrowserRouter>
      <DriverRoutes />
    </BrowserRouter>
  )
}
