import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    membership_type: 'joven' // joven, colaborador, protector
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Redirigir a Stripe checkout
      const membershipIds = {
        joven: 'membership_joven',
        colaborador: 'membership_colaborador',
        protector: 'membership_protector'
      }

      // Por ahora, guardamos en localStorage y redirigimos a Stripe
      localStorage.setItem('pending_registration', JSON.stringify(formData))

      // TODO: Llamar a backend para crear checkout session
      setMessage('ℹ️ Redirigiendo a Stripe...')
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (error) {
      console.error('Error al registrar:', error)
      setMessage('⚠️ Error al procesar el registro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--papel)',
      padding: 'var(--spacing-md)'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        background: 'white',
        padding: 'var(--spacing-xl)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        border: '2px solid var(--corporativo)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            color: 'var(--corporativo)',
            marginBottom: 'var(--spacing-sm)'
          }}>
            🍷 Hazte Socio
          </h1>
          <p style={{ color: 'var(--tinta)', opacity: 0.8 }}>
            Únete a La Tertulia y salva 47 años de cultura
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontWeight: '600',
              color: 'var(--tinta)'
            }}>
              Nombre completo
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Tu nombre"
              required
              style={{
                width: '100%',
                padding: 'var(--spacing-sm)',
                border: '2px solid var(--oro)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontWeight: '600',
              color: 'var(--tinta)'
            }}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="tu@email.com"
              required
              style={{
                width: '100%',
                padding: 'var(--spacing-sm)',
                border: '2px solid var(--oro)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontWeight: '600',
              color: 'var(--tinta)'
            }}>
              Tipo de membresía
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {[
                { value: 'joven', label: 'Socio Joven', price: '5€/mes o 50€/año' },
                { value: 'colaborador', label: 'Socio Colaborador', price: '10€/mes o 100€/año', recommended: true },
                { value: 'protector', label: 'Socio Protector', price: '25€/mes o 250€/año' }
              ].map((option) => (
                <label
                  key={option.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 'var(--spacing-sm)',
                    border: `2px solid ${formData.membership_type === option.value ? 'var(--corporativo)' : 'var(--oro)'}`,
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    background: formData.membership_type === option.value ? '#fff5f5' : 'white',
                    position: 'relative'
                  }}
                >
                  <input
                    type="radio"
                    name="membership_type"
                    value={option.value}
                    checked={formData.membership_type === option.value}
                    onChange={(e) => setFormData({...formData, membership_type: e.target.value})}
                    style={{ marginRight: 'var(--spacing-sm)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: 'var(--tinta)' }}>
                      {option.label}
                      {option.recommended && <span style={{
                        marginLeft: 'var(--spacing-xs)',
                        background: 'var(--oro)',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        color: 'white'
                      }}>⭐ Popular</span>}
                    </div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                      {option.price}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: 'var(--spacing-sm)',
              background: 'var(--corporativo)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Procesando...' : '🍷 Continuar al Pago'}
          </button>
        </form>

        {/* Mensaje */}
        {message && (
          <div style={{
            marginTop: 'var(--spacing-md)',
            padding: 'var(--spacing-sm)',
            borderRadius: 'var(--radius-sm)',
            background: '#d4edda',
            color: '#155724',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: 'var(--spacing-lg)',
          textAlign: 'center',
          fontSize: '0.9rem'
        }}>
          ¿Ya eres socio?{' '}
          <a
            href="/login"
            style={{
              color: 'var(--corporativo)',
              textDecoration: 'underline',
              fontWeight: '600'
            }}
          >
            Inicia sesión
          </a>
          <br />
          <a
            href="/"
            style={{
              color: 'var(--tinta)',
              opacity: 0.7
            }}
          >
            ← Volver a la web
          </a>
        </div>
      </div>
    </div>
  )
}

export default Register
