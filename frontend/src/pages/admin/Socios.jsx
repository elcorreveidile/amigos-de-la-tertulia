import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Socios() {
  const [user, setUser] = useState(null)
  const [socios, setSocios] = useState([])
  const [loading, setLoading] = useState(true)

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

    // TODO: Fetch real socios from API
    setSocios([
      {
        id: '1',
        name: 'María García',
        email: 'maria@example.com',
        membership_type: 'colaborador',
        status: 'active',
        member_since: '2026-01-15',
        total_paid: 120
      },
      {
        id: '2',
        name: 'Juan Rodríguez',
        email: 'juan@example.com',
        membership_type: 'protector',
        status: 'active',
        member_since: '2026-02-01',
        total_paid: 250
      },
      {
        id: '3',
        name: 'Ana Martínez',
        email: 'ana@example.com',
        membership_type: 'joven',
        status: 'active',
        member_since: '2026-03-10',
        total_paid: 50
      },
      {
        id: '4',
        name: 'Carlos López',
        email: 'carlos@example.com',
        membership_type: 'colaborador',
        status: 'pending_payment',
        member_since: '2026-04-01',
        total_paid: 10
      }
    ])
    setLoading(false)
  }, [])

  if (!user) {
    return <div>Cargando...</div>
  }

  const membershipLabels = {
    joven: 'Socio Joven',
    colaborador: 'Socio Colaborador',
    protector: 'Socio Protector'
  }

  const statusColors = {
    active: { background: '#d4edda', color: '#155724', label: 'Activo' },
    pending_payment: { background: '#fff3cd', color: '#856404', label: 'Pendiente' },
    inactive: { background: '#f8d7da', color: '#721c24', label: 'Inactivo' }
  }

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">🍷 Admin - La Tertulia</div>
        <div className="navbar-links">
          <Link to="/admin/dashboard" className="navbar-link">Dashboard</Link>
          <Link to="/admin/socios" className="navbar-link">Socios</Link>
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
          👥 Gestión de Socios
        </h1>
        <p style={{ opacity: 0.9 }}>
          Administra los socios de La Tertulia
        </p>
      </section>

      {/* Socios List */}
      <section className="section">
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Actions Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--spacing-lg)',
            flexWrap: 'wrap',
            gap: 'var(--spacing-md)'
          }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <input
                type="text"
                placeholder="🔍 Buscar socio..."
                style={{
                  width: '100%',
                  padding: 'var(--spacing-sm)',
                  border: '2px solid var(--oro)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              <select style={{
                padding: 'var(--spacing-sm)',
                border: '2px solid var(--oro)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '1rem',
                background: 'white'
              }}>
                <option value="">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="pending_payment">Pendientes</option>
                <option value="inactive">Inactivos</option>
              </select>

              <select style={{
                padding: 'var(--spacing-sm)',
                border: '2px solid var(--oro)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '1rem',
                background: 'white'
              }}>
                <option value="">Todos los tipos</option>
                <option value="joven">Socio Joven</option>
                <option value="colaborador">Socio Colaborador</option>
                <option value="protector">Socio Protector</option>
              </select>

              <button style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                background: 'var(--corporativo)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                📥 Exportar
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <div style={{
              background: 'white',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-sm)',
              border: '2px solid var(--corporativo)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--corporativo)' }}>
                {socios.length}
              </div>
              <div style={{ opacity: 0.8 }}>Total Socios</div>
            </div>
            <div style={{
              background: 'white',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-sm)',
              border: '2px solid #28a745',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
                {socios.filter(s => s.status === 'active').length}
              </div>
              <div style={{ opacity: 0.8 }}>Activos</div>
            </div>
            <div style={{
              background: 'white',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-sm)',
              border: '2px solid #ffc107',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>
                {socios.filter(s => s.status === 'pending_payment').length}
              </div>
              <div style={{ opacity: 0.8 }}>Pendientes</div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
              Cargando socios...
            </div>
          ) : socios.length === 0 ? (
            <div style={{
              background: 'white',
              padding: 'var(--spacing-xl)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              border: '2px solid var(--oro)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>🔍</div>
              <p style={{ color: 'var(--tinta)', opacity: 0.8 }}>
                No se encontraron socios
              </p>
            </div>
          ) : (
            <div style={{
              background: 'white',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--corporativo)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)'
            }}>
              {/* Table Header */}
              <div style={{
                background: 'var(--corporativo)',
                color: 'white',
                padding: 'var(--spacing-md)',
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1fr 1.5fr',
                gap: 'var(--spacing-sm)',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                <div>Nombre</div>
                <div>Email</div>
                <div>Tipo</div>
                <div>Estado</div>
                <div>Total</div>
                <div>Acciones</div>
              </div>

              {/* Table Body */}
              {socios.map((socio) => (
                <div
                  key={socio.id}
                  style={{
                    padding: 'var(--spacing-md)',
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1fr 1.5fr',
                    gap: 'var(--spacing-sm)',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                    fontSize: '0.9rem'
                  }}
                >
                  <div style={{ fontWeight: '500', color: 'var(--tinta)' }}>
                    {socio.name}
                  </div>
                  <div style={{ color: 'var(--tinta)', opacity: 0.8 }}>
                    {socio.email}
                  </div>
                  <div style={{ color: 'var(--tinta)' }}>
                    {membershipLabels[socio.membership_type]}
                  </div>
                  <div>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      ...statusColors[socio.status]
                    }}>
                      {statusColors[socio.status].label}
                    </span>
                  </div>
                  <div style={{ fontWeight: '600', color: 'var(--corporativo)' }}>
                    {socio.total_paid}€
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                    <button style={{
                      padding: '4px 8px',
                      background: 'var(--oro)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}>
                      👁️
                    </button>
                    <button style={{
                      padding: '4px 8px',
                      background: 'var(--corporativo)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}>
                      ✏️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div style={{
            marginTop: 'var(--spacing-lg)',
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--spacing-sm)'
          }}>
            <button style={{
              padding: 'var(--spacing-xs) var(--spacing-md)',
              background: 'var(--corporativo)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer'
            }}>
              ← Anterior
            </button>
            <button style={{
              padding: 'var(--spacing-xs) var(--spacing-md)',
              background: 'var(--oro)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer'
            }}>
              1
            </button>
            <button style={{
              padding: 'var(--spacing-xs) var(--spacing-md)',
              background: 'white',
              color: 'var(--corporativo)',
              border: '2px solid var(--corporativo)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer'
            }}>
              2
            </button>
            <button style={{
              padding: 'var(--spacing-xs) var(--spacing-md)',
              background: 'white',
              color: 'var(--corporativo)',
              border: '2px solid var(--corporativo)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer'
            }}>
              Siguiente →
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Socios
