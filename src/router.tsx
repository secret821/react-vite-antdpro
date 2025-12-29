import { createBrowserRouter, Navigate } from 'react-router-dom'
import type { ReactElement } from 'react'
import { ProShell } from './layout/ProShell'
import { LoginPage } from './pages/LoginPage'
import { Dashboard } from './pages/Dashboard'
import { StockOrderList } from './pages/StockOrderList'
import { useAuthStore } from './stores/auth-store'

// 路由守卫：未登录时重定向到登录页
function ProtectedRoute({ children }: { children: ReactElement }) {
  const { auth } = useAuthStore()
  if (!auth.accessToken) {
    return <Navigate to="/login" replace />
  }
  return children
}

// 登录页守卫：已登录时重定向到首页
function LoginRoute() {
  const { auth } = useAuthStore()
  if (auth.accessToken) {
    return <Navigate to="/" replace />
  }
  return <LoginPage />
}

// 受保护的路由布局
function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <ProShell />
    </ProtectedRoute>
  )
}

export const router = createBrowserRouter(
  [
    { 
      path: '/login', 
      element: <LoginRoute />
    },
    {
      path: '/',
      element: <ProtectedLayout />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: 'stock-orders', element: <StockOrderList /> },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
)

