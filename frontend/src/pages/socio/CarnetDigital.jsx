import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function CarnetDigital() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  if (!user) {
    return <div>Cargando...</div>
  }

  const memberNumber = user.id?.slice(0, 8).toUpperCase() || 'TERT0001'
  const memberSince = user.member_since || '2026'

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">🍷 La Tertulia</div>
        <div className="navbar-links">
          <Link to="/socio/dashboard" className="navbar-link">Dashboard</Link>
          <Link to="/socio/carnet" className="navbar-link">Carnet</Link>
          <Link to="/socio/pagos" className="navbar-link">Mis Pagos</Link>
        </div>
      </nav>

      {/* Header */}
      <section style={{
        background: 'var(--corporativo)',
        color: 'white',
        padding: 'var(--spacing-xl)',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.5rem'
        }}>
          🪪 Carnet Digital
        </h1>
      </section>

      {/* Carnet Card */}
      <section className="section">
        <div style={{
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          {/* Front of Card */}
          <div style={{
            background: 'linear-gradient(135deg, var(--corporativo) 0%, #9a1830 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-xl)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(196, 30, 58, 0.4)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            {/* Background pattern */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            {/* Logo */}
            <div style={{
              position: 'relative',
              zIndex: 1,
              marginBottom: 'var(--spacing-lg)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '4rem' }}>🍷</div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.8rem',
                margin: 0
              }}>
                La Tertulia
              </h2>
              <p style={{ opacity: 0.9, margin: 0 }}>Socio Oficial</p>
            </div>

            {/* Member Info */}
            <div style={{
              position: 'relative',
              zIndex: 1,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-lg)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-md)'
              }}>
                <div>
                  <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>Socio Nº</div>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    letterSpacing: '2px'
                  }}>
                    {memberNumber}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>Desde</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '600' }}>
                    {memberSince}
                  </div>
                </div>
              </div>

              <div style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.3)',
                paddingTop: 'var(--spacing-md)',
                marginTop: 'var(--spacing-md)'
              }}>
                <div style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: 'var(--spacing-xs)' }}>
                  Titular
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: '600' }}>
                  {user.name || 'Socio de La Tertulia'}
                </div>
              </div>
            </div>

            {/* Valid Thru */}
            <div style={{
              position: 'relative',
              zIndex: 1,
              marginTop: 'var(--spacing-lg)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ opacity: 0.8, fontSize: '0.85rem' }}>Válido hasta</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>12/2027</div>
              </div>
              <div style={{
                background: 'var(--oro)',
                color: 'var(--tinta)',
                padding: 'var(--spacing-xs) var(--spacing-md)',
                borderRadius: '20px',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                ✅ ACTIVO
              </div>
            </div>
          </div>

          {/* QR Code Placeholder */}
          <div style={{
            background: 'white',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-xl)',
            textAlign: 'center',
            border: '2px solid var(--corporativo)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--corporativo)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              Código QR de Socio
            </h3>

            {/* QR Placeholder */}
            <div style={{
              width: '200px',
              height: '200px',
              margin: '0 auto var(--spacing-lg)',
              background: '#f0f0f0',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px dashed var(--oro)'
            }}>
              <div style={{ textAlign: 'center', color: 'var(--tinta)', opacity: 0.6 }}>
                <div style={{ fontSize: '3rem' }}>📱</div>
                <div style={{ fontSize: '0.9rem' }}>QR Code</div>
              </div>
            </div>

            <p style={{ color: 'var(--tinta)', opacity: 0.8 }}>
              Muestra este código en el bar para obtener tus descuentos
            </p>
          </div>

          {/* Benefits List */}
          <div style={{
            marginTop: 'var(--spacing-lg)',
            background: 'white',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-lg)',
            border: '2px solid var(--oro)'
          }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--corporativo)',
              marginBottom: 'var(--spacing-md)',
              textAlign: 'center'
            }}>
              🎁 Tus Beneficios
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {[
                '15% descuento en consumiciones',
                'Acceso a eventos exclusivos',
                'Voto en asamblea de socios',
                'Carnet digital siempre disponible',
                'Invitado gratuito en cumpleaños',
                'Reserva prioritaria de mesa'
              ].map((benefit, index) => (
                <li key={index} style={{
                  padding: 'var(--spacing-xs) 0',
                  borderBottom: index < 5 ? '1px solid rgba(0,0,0,0.1)' : 'none',
                  color: 'var(--tinta)',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{ marginRight: 'var(--spacing-sm)', color: 'var(--corporativo)' }}>✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CarnetDigital
