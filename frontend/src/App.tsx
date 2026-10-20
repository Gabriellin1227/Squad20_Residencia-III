import { lazy, Suspense } from 'react'
import { StateMessage } from '@/components/StateMessage'
import { AppLayout } from '@/layouts/AppLayout'

const VehiclesPage = lazy(() =>
  import('@/features/vehicles/VehiclesPage').then((module) => ({
    default: module.VehiclesPage,
  })),
)

export function App() {
  return (
    <AppLayout>
      <Suspense fallback={<StateMessage variant="loading" title="Carregando..." />}>
        <VehiclesPage />
      </Suspense>
    </AppLayout>
  )
}
