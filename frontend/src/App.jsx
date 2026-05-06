import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import DashboardSocio from './pages/socio/DashboardSocio'
import CarnetDigital from './pages/socio/CarnetDigital'
import MisPagos from './pages/socio/MisPagos'
import DashboardAdmin from './pages/admin/DashboardAdmin'
import Socios from './pages/admin/Socios'
import ProtectedRoute from './components/ProtectedRoute'
import './styles/variables.css'
import './styles/vintage.css'

function App() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Área de Socio */}
      <Route
        path="/socio/dashboard"
        element={
          <ProtectedRoute allowedRoles={['socio', 'admin']}>
            <DashboardSocio />
          </ProtectedRoute>
        }
      />
      <Route
        path="/socio/carnet"
        element={
          <ProtectedRoute allowedRoles={['socio', 'admin']}>
            <CarnetDigital />
          </ProtectedRoute>
        }
      />
      <Route
        path="/socio/pagos"
        element={
          <ProtectedRoute allowedRoles={['socio', 'admin']}>
            <MisPagos />
          </ProtectedRoute>
        }
      />

      {/* Área de Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/socios"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Socios />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
