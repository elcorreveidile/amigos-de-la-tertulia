import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function DashboardSocio() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  if (!user) {
    return <div>Cargando...</div>
  }

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">🍷 La Tertulia</div>
        <div className="navbar-links">
          <Link to="/socio/dashboard" className="navbar-link">Dashboard</Link>
          <Link to="/socio/carnet" className="navbar-link">Carnet</Link>
          <Link to="/socio/pagos" className="navbar-link">Mis Pagos</Link>
          <button onClick={handleLogout} style={{
            background: 'none',
            border: 'none',
            color: 'var(--corporativo)',
            cursor: 'pointer',
            fontWeight: '600'
          }}>
            Cerrar Sesión
          </button>
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
          ¡Bienvenido, {user.name || 'Socio'}!
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
          Gracias por ser parte de La Tertulia
        </p>
      </section>

      {/* Info Cards */}
      <section className="section">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--spacing-lg)',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <Link
            to="/socio/carnet"
            style={{
              textDecoration: 'none',
              background: 'white',
              padding: 'var(--spacing-lg)',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--corporativo)',
              boxShadow: 'var(--shadow-md)',
              transition: 'var(--transition)',
              display: 'block'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>🪪</div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              color: 'var(--corporativo)',
              marginBottom: 'var(--spacing-sm)'
            }}>
              Carnet Digital
            </h3>
            <p style={{ color: 'var(--tinta)', opacity: 0.8 }}>
              Accede a tu carnet con QR code
            </p>
          </Link>

          <Link
            to="/socio/pagos"
            style={{
              textDecoration: 'none',
              background: 'white',
              padding: 'var(--spacing-lg)',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--corporativo)',
              boxShadow: 'var(--shadow-md)',
              transition: 'var(--transition)',
              display: 'block'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>💳</div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              color: 'var(--corporativo)',
              marginBottom: 'var(--spacing-sm)'
            }}>
              Mis Pagos
            </h3>
            <p style={{ color: 'var(--tinta)', opacity: 0.8 }}>
              Historial de cuotas y facturas
            </p>
          </Link>

          <div style={{
            background: 'white',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-md)',
            border: '2px solid var(--oro)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>📅</div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              color: 'var(--corporativo)',
              marginBottom: 'var(--spacing-sm)'
            }}>
              Próximos Eventos
            </h3>
            <p style={{ color: 'var(--tinta)', opacity: 0.8 }}>
              Próximamente
            </p>
          </div>
        </div>
      </section>

      {/* Status */}
      <section style={{
        background: 'var(--papel)',
        padding: 'var(--spacing-xl)',
        borderTop: '4px solid var(--corporativo)'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            color: 'var(--corporativo)',
            marginBottom: 'var(--spacing-md)'
          }}>
            Estado de tu Membresía
          </h2>
          <div style={{
            background: 'white',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-md)',
            border: '2px solid var(--oro)'
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: 'var(--spacing-sm)'
            }}>
              ✅
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              color: 'var(--tinta)',
              marginBottom: 'var(--spacing-sm)'
            }}>
              Socio Activo
            </h3>
            <p style={{ opacity: 0.8 }}>
              {user.membership_type || 'Socio Colaborador'}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DashboardSocio
