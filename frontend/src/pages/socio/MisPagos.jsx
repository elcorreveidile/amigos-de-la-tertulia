import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function MisPagos() {
  const [user, setUser] = useState(null)
  const [payments, setPayments] = useState([])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // TODO: Fetch real payments from API
    setPayments([
      {
        id: 'pay_1',
        date: '2026-05-01',
        amount: 10,
        status: 'completed',
        description: 'Cuota mensual - Socio Colaborador'
      },
      {
        id: 'pay_2',
        date: '2026-04-01',
        amount: 10,
        status: 'completed',
        description: 'Cuota mensual - Socio Colaborador'
      },
      {
        id: 'pay_3',
        date: '2026-03-01',
        amount: 10,
        status: 'completed',
        description: 'Cuota mensual - Socio Colaborador'
      }
    ])
  }, [])

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
          💳 Mis Pagos
        </h1>
        <p style={{ opacity: 0.9 }}>
          Historial de cuotas y facturas
        </p>
      </section>

      {/* Payments List */}
      <section className="section">
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Summary */}
          <div style={{
            background: 'white',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-md)',
            border: '2px solid var(--corporativo)',
            marginBottom: 'var(--spacing-lg)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--corporativo)',
              marginBottom: 'var(--spacing-md)'
            }}>
              Resumen
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--spacing-md)'
            }}>
              <div>
                <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Total Pagado</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--tinta)' }}>
                  30€
                </div>
              </div>
              <div>
                <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Pagos Realizados</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--corporativo)' }}>
                  {payments.length}
                </div>
              </div>
              <div>
                <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Próxima Cuota</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--oro)' }}>
                  01/06
                </div>
              </div>
            </div>
          </div>

          {/* Payments Table */}
          <div style={{
            background: 'white',
            borderRadius: 'var(--radius-md)',
            border: '2px solid var(--oro)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{
              background: 'var(--corporativo)',
              color: 'white',
              padding: 'var(--spacing-md)',
              fontFamily: 'var(--font-display)',
              fontSize: '1.3rem'
            }}>
              Historial de Pagos
            </div>

            {payments.length === 0 ? (
              <div style={{
                padding: 'var(--spacing-xl)',
                textAlign: 'center',
                color: 'var(--tinta)',
                opacity: 0.7
              }}>
                No hay pagos registrados
              </div>
            ) : (
              <div>
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    style={{
                      padding: 'var(--spacing-md)',
                      borderBottom: '1px solid rgba(0,0,0,0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 'var(--spacing-sm)'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ fontWeight: '600', color: 'var(--tinta)' }}>
                        {payment.description}
                      </div>
                      <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                        {new Date(payment.date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-md)'
                    }}>
                      <div style={{
                        textAlign: 'right',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        color: 'var(--corporativo)'
                      }}>
                        {payment.amount}€
                      </div>

                      <div style={{
                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        background: '#d4edda',
                        color: '#155724'
                      }}>
                        ✅ Pagado
                      </div>

                      <button style={{
                        padding: 'var(--spacing-xs) var(--spacing-md)',
                        background: 'var(--oro)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}>
                        📄 Factura
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Box */}
          <div style={{
            marginTop: 'var(--spacing-lg)',
            padding: 'var(--spacing-md)',
            background: '#fff3cd',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid #ffc107',
            fontSize: '0.9rem',
            color: '#856404'
          }}>
            <strong>💡 Información:</strong> Todos los pagos se procesan a través de Stripe.
            Puedes cancelar o cambiar tu plan de membresía en cualquier momento.
          </div>
        </div>
      </section>
    </div>
  )
}

export default MisPagos
