import { useState } from 'react'
import '../styles/variables.css'
import '../styles/vintage.css'

function CarnetDigital({ user, subscription }) {
  const [showQR, setShowQR] = useState(false)

  // Generar número de socio aleatorio para demo
  const socioNumber = user?.id ? `LT-${user.id.slice(0, 8).toUpperCase()}` : 'LT-PENDING'

  // Determinar tipo de membresía
  const membershipType = subscription?.membership_name || 'Pendiente'

  return (
    <div className="card-vintage" style={{
      maxWidth: '400px',
      margin: '2rem auto',
      background: 'linear-gradient(135deg, var(--papel) 0%, rgba(197, 160, 89, 0.1) 100%)',
      border: '2px solid var(--oro)'
    }}>
      {/* Header del Carnet */}
      <div style={{
        textAlign: 'center',
        borderBottom: `2px solid var(--vino)`,
        paddingBottom: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🍷</div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--vino)',
          fontSize: '1.8rem',
          marginBottom: '0.25rem'
        }}>
          Amigos de La Tertulia
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--tinta)', opacity: 0.7 }}>
          Carnet Digital Oficial
        </p>
      </div>

      {/* Info del Socio */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--vino)',
          fontSize: '1.3rem',
          marginBottom: '1rem'
        }}>
          {user?.name || user?.email?.split('@')[0]}
        </h3>

        <div style={{
          backgroundColor: 'rgba(114, 47, 55, 0.05)',
          padding: '1rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: '600', color: 'var(--tinta)' }}>Nº de Socio:</span>
            <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: 'var(--vino)' }}>
              {socioNumber}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: '600', color: 'var(--tinta)' }}>Tipo:</span>
            <span style={{ color: 'var(--tinta)' }}>{membershipType}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '600', color: 'var(--tinta)' }}>Estado:</span>
            <span style={{
              color: subscription?.status === 'active' ? 'var(--vino)' : 'var(--emergencia)',
              fontWeight: '600'
            }}>
              {subscription?.status === 'active' ? '✅ Activo' : '⚠️ Inactivo'}
            </span>
          </div>
        </div>

        {user?.member_since && (
          <p style={{ fontSize: '0.85rem', color: 'var(--tinta)', opacity: 0.7, textAlign: 'center' }}>
            Socio desde: {new Date(user.member_since).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long'
            })}
          </p>
        )}
      </div>

      {/* QR Code (simulado) */}
      {showQR ? (
        <div style={{
          textAlign: 'center',
          padding: '1.5rem',
          backgroundColor: 'rgba(197, 160, 89, 0.1)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '150px',
            height: '150px',
            margin: '0 auto 1rem',
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 10px,
              var(--tinta) 10px,
              var(--tinta) 20px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 10px,
              var(--tinta) 10px,
              var(--tinta) 20px
            )`,
            backgroundSize: '20px 20px',
            opacity: 0.8
          }}></div>
          <p style={{ fontSize: '0.85rem', color: 'var(--tinta)', opacity: 0.8 }}>
            Escanea este código en el bar
          </p>
        </div>
      ) : (
        <button
          className="btn btn-outline"
          style={{ width: '100%', marginBottom: '1.5rem' }}
          onClick={() => setShowQR(true)}
        >
          📱 Mostrar Código QR
        </button>
      )}

      {/* Beneficios */}
      <div style={{
        borderTop: `1px solid var(--oro)`,
        paddingTop: '1.5rem'
      }}>
        <h4 style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--vino)',
          marginBottom: '0.75rem',
          fontSize: '1.1rem'
        }}>
          Beneficios Activos
        </h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem' }}>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(197, 160, 89, 0.2)' }}>
            ✓ Acceso a eventos exclusivos
          </li>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(197, 160, 89, 0.2)' }}>
            ✓ Descuentos en consumiciones
          </li>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(197, 160, 89, 0.2)' }}>
            ✓ Voto en asamblea
          </li>
          <li style={{ padding: '0.5rem 0' }}>
            ✓ Carnet digital siempre disponible
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '1.5rem',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: 'var(--tinta)',
        opacity: 0.6
      }}>
        <p>Válido hasta: {
          subscription?.current_period_end
            ? new Date(subscription.current_period_end).toLocaleDateString('es-ES')
            : 'Pendiente de activación'
        }</p>
        <p style={{ marginTop: '0.5rem' }}>
          amigoslalatertulia.com
        </p>
      </div>
    </div>
  )
}

export default CarnetDigital
