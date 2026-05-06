import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { authAPI, subscriptionsAPI } from '../lib/api'
import CarnetDigital from './CarnetDigital'
import '../styles/variables.css'
import '../styles/vintage.css'

function Dashboard() {
  const [searchParams] = useSearchParams()
  const [user, setUser] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Verificar si viene de un checkout exitoso
    const sessionId = searchParams.get('session_id')
    if (sessionId) {
      // TODO: Verificar sesión con backend
      console.log('Checkout session ID:', sessionId)
    }

    loadUserData()
  }, [searchParams])

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('No estás autenticado. Por favor, inicia sesión.')
        setLoading(false)
        return
      }

      // Cargar usuario
      const userData = await authAPI.getProfile()
      setUser(userData)

      // Cargar suscripciones si es socio
      if (userData.role === 'socio') {
        const subs = await subscriptionsAPI.getUserSubscriptions()
        if (subs && subs.length > 0) {
          setSubscription(subs[0])
        }
      }

      setLoading(false)
    } catch (err) {
      console.error('Error loading user data:', err)
      setError('Error al cargar tus datos. Por favor, recarga la página.')
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('¿Estás seguro de que quieres cancelar tu membresía?')) {
      return
    }

    try {
      await subscriptionsAPI.cancel(subscription.id)
      alert('Membresía cancelada correctamente')
      loadUserData()
    } catch (err) {
      console.error('Error cancelling subscription:', err)
      alert('Error al cancelar la membresía')
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--papel)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: `4px solid ${'var(--oro)'}`,
            borderTopColor: 'var(--vino)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: 'var(--tinta)' }}>Cargando...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--papel)',
        padding: '2rem'
      }}>
        <div className="card-vintage" style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h2 style={{ color: 'var(--vino)', marginBottom: '1rem' }}>Error</h2>
          <p style={{ marginBottom: '1.5rem' }}>{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.href = '/'}
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: 'var(--papel)', minHeight: '100vh' }}>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-brand">🍷 Amigos de La Tertulia</div>
        <div className="navbar-links">
          <a href="/" className="navbar-link">Inicio</a>
          <button
            onClick={() => {
              localStorage.removeItem('token')
              window.location.href = '/'
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--tinta)',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        {/* Welcome Header */}
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '3rem',
            color: 'var(--vino)',
            marginBottom: '0.5rem'
          }}>
            ¡Bienvenido, {user?.name || user?.email?.split('@')[0]}!
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--tinta)', opacity: 0.8 }}>
            {user?.role === 'socio'
              ? 'Gracias por ser parte de La Tertulia'
              : 'Completa tu pago para activar tu membresía'}
          </p>
        </div>

        {/* Status Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* User Info Card */}
          <div className="card-vintage">
            <h3 style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--vino)',
              marginBottom: '1.5rem',
              fontSize: '1.5rem'
            }}>
              Tu Perfil
            </h3>
            <div style={{ lineHeight: '2' }}>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Rol:</strong> {
                user?.role === 'socio' ? 'Socio' :
                user?.role === 'admin' ? 'Administrador' :
                'Simpatizante'
              }</p>
              <p><strong>Estado:</strong> {
                user?.status === 'active' ? '✅ Activo' :
                user?.status === 'pending_payment' ? '⚠️ Pago Pendiente' :
                '❌ Inactivo'
              }</p>
              {user?.member_since && (
                <p><strong>Socio desde:</strong> {new Date(user.member_since).toLocaleDateString('es-ES')}</p>
              )}
            </div>
          </div>

          {/* Subscription Card */}
          {subscription ? (
            <div className="card-vintage">
              <h3 style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--vino)',
                marginBottom: '1.5rem',
                fontSize: '1.5rem'
              }}>
                Tu Membresía
              </h3>
              <div style={{ lineHeight: '2' }}>
                <p><strong>Estado:</strong> {
                  subscription.status === 'active' ? '✅ Activa' :
                  subscription.status === 'past_due' ? '⚠️ Pago Vencido' :
                  subscription.status
                }</p>
                <p><strong>Próxima renovación:</strong> {
                  new Date(subscription.current_period_end).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                }</p>
              </div>
              {subscription.status === 'active' && (
                <button
                  className="btn btn-outline"
                  style={{ marginTop: '1.5rem', width: '100%' }}
                  onClick={handleCancelSubscription}
                >
                  Cancelar Membresía
                </button>
              )}
            </div>
          ) : (
            <div className="card-vintage" style={{
              border: '2px solid var(--emergencia)',
              background: 'linear-gradient(to right, rgba(211, 47, 47, 0.05), transparent)'
            }}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--emergencia)',
                marginBottom: '1.5rem',
                fontSize: '1.5rem'
              }}>
                ⚠️ Membresía Inactiva
              </h3>
              <p style={{ marginBottom: '1.5rem' }}>
                Aún no tienes una membresía activa. Hazte socio para disfrutar de todos los beneficios.
              </p>
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => window.location.href = '/#unete'}
              >
                Hazte Socio →
              </button>
            </div>
          )}
        </div>

        {/* Carnet Digital */}
        {user?.role === 'socio' && subscription?.status === 'active' && (
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--vino)',
              textAlign: 'center',
              marginBottom: '2rem',
              fontSize: '2rem'
            }}>
              📱 Tu Carnet Digital
            </h2>
            <CarnetDigital user={user} subscription={subscription} />
          </div>
        )}

        {/* Quick Actions */}
        <div className="card-vintage">
          <h3 style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--vino)',
            marginBottom: '1.5rem',
            fontSize: '1.5rem'
          }}>
            Acciones Rápidas
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <button className="btn btn-outline">
              📱 Ver Carnet Digital
            </button>
            <button className="btn btn-outline">
              📅 Próximos Eventos
            </button>
            <button className="btn btn-outline">
              📜 Historial de Pagos
            </button>
            <button className="btn btn-outline">
              ⚙️ Configuración
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer" style={{ marginTop: '4rem' }}>
        <div className="footer-symbol">🍷</div>
        <p style={{ opacity: 0.8 }}>
          Amigos de La Tertulia - Salvando 47 años de cultura en Granada
        </p>
      </footer>
    </div>
  )
}

export default Dashboard
