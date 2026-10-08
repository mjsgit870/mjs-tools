import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import './index.css'
import { RoutePending } from './components/layout/RoutePending'
import { routeTree } from './routeTree.gen'

const router = createRouter({
  routeTree,
  defaultPendingMs: 150,
  defaultPendingMinMs: 300,
  defaultPendingComponent: RoutePending,
  defaultViewTransition: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
