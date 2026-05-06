import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function DashboardAdmin() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    totalSocios: 47,
    activeSocios: 42,
    monthlyRevenue: 420,
    newSociosThisMonth: 5
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== 'admin') {
        window.location.href = '/'
        return
      }
      setUser(parsedUser)
    }
  }, [])

  if (!user) {
    return <div>Cargando...</div>
  }

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">🍷 Admin - La Tertulia</div>
        <div className="navbar-links">
          <Link to="/admin/dashboard" className="navbar-link">Dashboard</Link>
          <Link to="/admin/socios" className="navbar-link">Socios</Link>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault()
              localStorage.removeItem('user')
              window.location.href = '/'
            }}
            className="navbar-link"
          >
            Cerrar Sesión
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        background: 'var(--corporativo)',
        color: 'white',
        padding: 'var(--spacing-xl)',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.5rem',
          marginBottom: 'var(--spacing-sm)'
        }}>
          Panel de Administración
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
          Gestión de La Tertulia
        </p>
      </section>

      {/* Stats Grid */}
      <section className="section">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--spacing-lg)',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            background: 'white',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-md)',
            border: '2px solid var(--corporativo)',
            boxShadow: 'var(--shadow-md)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>👥</div>
            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: 'var(--corporativo)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              {stats.totalSocios}
            </div>
            <div style={{ color: 'var(--tinta)', opacity: 0.8 }}>
              Total Socios
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-md)',
            border: '2px solid var(--corporativo)',
            boxShadow: 'var(--shadow-md)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>✅</div>
            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#28a745',
              marginBottom: 'var(--spacing-xs)'
            }}>
              {stats.activeSocios}
            </div>
            <div style={{ color: 'var(--tinta)', opacity: 0.8 }}>
              Socios Activos
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-md)',
            border: '2px solid var(--corporativo)',
            boxShadow: 'var(--shadow-md)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>💰</div>
            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: 'var(--oro)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              {stats.monthlyRevenue}€
            </div>
            <div style={{ color: 'var(--tinta)', opacity: 0.8 }}>
              Ingresos Mensuales
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-md)',
            border: '2px solid var(--corporativo)',
            boxShadow: 'var(--shadow-md)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>📈</div>
            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: 'var(--corporativo)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              +{stats.newSociosThisMonth}
            </div>
            <div style={{ color: 'var(--tinta)', opacity: 0.8 }}>
              Nuevos este Mes
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section style={{
        background: 'var(--papel)',
        padding: 'var(--spacing-xl)',
        borderTop: '4px solid var(--corporativo)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            color: 'var(--corporativo)',
            marginBottom: 'var(--spacing-lg)',
            textAlign: 'center'
          }}>
            ⚡ Acciones Rápidas
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--spacing-md)'
          }}>
            <Link
              to="/admin/socios"
              style={{
                display: 'block',
                background: 'white',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--radius-md)',
                border: '2px solid var(--corporativo)',
                textDecoration: 'none',
                color: 'var(--tinta)',
                textAlign: 'center',
                transition: 'var(--transition)'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>👥</div>
              <div style={{ fontWeight: '600' }}>Gestionar Socios</div>
            </Link>

            <div style={{
              background: 'white',
              padding: 'var(--spacing-lg)',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--oro)',
              color: 'var(--tinta)',
              textAlign: 'center',
              opacity: 0.6,
              cursor: 'not-allowed'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>📅</div>
              <div style={{ fontWeight: '600' }}>Crear Evento</div>
              <div style={{ fontSize: '0.8rem', marginTop: 'var(--spacing-xs)' }}>Próximamente</div>
            </div>

            <div style={{
              background: 'white',
              padding: 'var(--spacing-lg)',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--oro)',
              color: 'var(--tinta)',
              textAlign: 'center',
              opacity: 0.6,
              cursor: 'not-allowed'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>📧</div>
              <div style={{ fontWeight: '600' }}>Enviar Comunicado</div>
              <div style={{ fontSize: '0.8rem', marginTop: 'var(--spacing-xs)' }}>Próximamente</div>
            </div>

            <div style={{
              background: 'white',
              padding: 'var(--spacing-lg)',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--oro)',
              color: 'var(--tinta)',
              textAlign: 'center',
              opacity: 0.6,
              cursor: 'not-allowed'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>📊</div>
              <div style={{ fontWeight: '600' }}>Estadísticas</div>
              <div style={{ fontSize: '0.8rem', marginTop: 'var(--spacing-xs)' }}>Próximamente</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DashboardAdmin
