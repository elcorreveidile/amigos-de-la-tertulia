import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleMagicLink = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Llamar al backend para enviar magic link
      const response = await fetch('http://localhost:8000/auth/request-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('✅ Enlace mágico enviado a tu correo. Revisa tu bandeja de entrada.')
      } else {
        setMessage(`❌ Error: ${data.detail || 'No se pudo enviar el enlace'}`)
      }
    } catch (error) {
      console.error('Error al enviar magic link:', error)
      setMessage('⚠️ Error de conexión. Verifica que el servidor esté corriendo.')
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
        maxWidth: '400px',
        width: '100%',
        background: 'white',
        padding: 'var(--spacing-xl)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        border: '2px solid var(--corporativo)'
      }}>
        {/* Logo/Brand */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            color: 'var(--corporativo)',
            marginBottom: 'var(--spacing-sm)'
          }}>
            🍷 La Tertulia
          </h1>
          <p style={{ color: 'var(--tinta)', opacity: 0.8 }}>
            Acceso de Socios
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleMagicLink}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              style={{
                width: '100%',
                padding: 'var(--spacing-sm)',
                border: '2px solid var(--oro)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '1rem',
                fontFamily: 'var(--font-body)'
              }}
            />
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
            {loading ? 'Enviando...' : '🔗 Enviar Magic Link'}
          </button>
        </form>

        {/* Mensaje */}
        {message && (
          <div style={{
            marginTop: 'var(--spacing-md)',
            padding: 'var(--spacing-sm)',
            borderRadius: 'var(--radius-sm)',
            background: message.startsWith('✅') ? '#d4edda' : '#f8d7da',
            color: message.startsWith('✅') ? '#155724' : '#721c24',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        {/* Info */}
        <div style={{
          marginTop: 'var(--spacing-lg)',
          padding: 'var(--spacing-md)',
          background: '#fff3cd',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          color: '#856404'
        }}>
          <strong>¿Cómo funciona?</strong>
          <br />
          1. Introduce tu email
          <br />
          2. Recibirás un enlace mágico
          <br />
          3. Haz clic y accederás automáticamente
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 'var(--spacing-lg)',
          textAlign: 'center',
          fontSize: '0.9rem'
        }}>
          <a
            href="/"
            style={{
              color: 'var(--corporativo)',
              textDecoration: 'underline'
            }}
          >
            ← Volver a la web
          </a>
        </div>
      </div>
    </div>
  )
}

export default Login
