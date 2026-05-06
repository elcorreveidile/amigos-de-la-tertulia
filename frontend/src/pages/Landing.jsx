import { useState } from 'react'
import { createCheckoutSession } from '../lib/stripe'
import '../styles/variables.css'
import '../styles/vintage.css'

function Landing() {
  const [sociosCount] = useState(47)
  const [billingPeriod, setBillingPeriod] = useState('monthly') // 'monthly' o 'yearly'
  const metaSocios = 100

  const benefits = [
    {
      title: "Eventos Exclusivos",
      description: "Acceso prioritario a conciertos, lecturas de poesía y noches de tertulia. Reserva tu mesa antes que nadie."
    },
    {
      title: "Voto en Asamblea",
      description: "Tu voz cuenta. Decide el futuro del bar, aprueba actas y elige al comité de socios cada año."
    },
    {
      title: "Descuentos Especiales",
      description: "15% de descuento en todas las consumiciones. Precios especiales para eventos y cenas cerradas."
    },
    {
      title: "Carnet Digital",
      description: "Tu carnet de socio siempre en el móvil. Acceso con QR, historial de pagos y estado de membresía."
    },
    {
      title: "Eventos Anuales",
      description: "Celebra con nosotros: Aniversario del bar (47 años), Nochevieja en familia, Fiesta de primavera."
    },
    {
      title: "Preservar Historia",
      description: "Forma parte de la historia. Tu aporte mantiene vivo un espacio cultural único en Granada desde 1977."
    }
  ]

  const memberships = [
    {
      name: "Socio Joven",
      priceMonthly: 5,
      priceYearly: 50,
      benefits: [
        "Acceso a eventos exclusivos",
        "10% descuento en consumiciones",
        "Carnet digital",
        "Voto en asamblea"
      ],
      featured: false
    },
    {
      name: "Socio Colaborador",
      priceMonthly: 10,
      priceYearly: 100,
      benefits: [
        "Todo lo de Socio Joven",
        "15% descuento en consumiciones",
        "Reserva prioritaria de mesa",
        "Invitado gratuito en tu cumpleaños"
      ],
      featured: true
    },
    {
      name: "Socio Protector",
      priceMonthly: 25,
      priceYearly: 250,
      benefits: [
        "Todo lo de Socio Colaborador",
        "20% descuento en consumiciones",
        "Mesa reservada permanente",
        "Evento privado anual incluido",
        "Tu nombre en el muro de honor"
      ],
      featured: false
    }
  ]

  const testimonials = [
    {
      text: "Llevo 30 años viniendo aquí. Conocí a mi mujer en una tertulia del martes. La Tertulia no es solo un bar, es mi segunda casa.",
      author: "Manuel Rodríguez",
      role: "Socio desde 1994"
    },
    {
      text: "Cuando era estudiante, pasaba tardes enteras estudiando con una caña y un tapa. Ahora traigo a mis hijos. Que cierre sería perder una parte de Granada.",
      author: "Carmen Martínez",
      role: "Socia desde 2008"
    },
    {
      text: "Las noches de poesía, los conciertos de flamenco... hay magia en estas paredes. Hay que salvarlo.",
      author: "Luis García",
      role: "Socio desde 2015"
    }
  ]

  const handleJoin = async (membership, billingPeriod = 'monthly') => {
    try {
      // Mapear nombre de membresía a ID
      const membershipId = {
        'Socio Joven': 'membership_joven',
        'Socio Colaborador': 'membership_colaborador',
        'Socio Protector': 'membership_protector'
      }[membership.name]

      if (!membershipId) {
        throw new Error('Tipo de membresía no válido')
      }

      // Crear sesión de checkout
      await createCheckoutSession(membershipId, billingPeriod)
    } catch (error) {
      console.error('Error al iniciar checkout:', error)
      alert(`Error: ${error.message}`)
    }
  }

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-brand">🍷 Amigos de La Tertulia</div>
        <div className="navbar-links">
          <a href="#manifiesto" className="navbar-link">Manifiesto</a>
          <a href="#beneficios" className="navbar-link">Beneficios</a>
          <a href="#unete" className="navbar-link">Hazte Socio</a>
          <a href="/login" className="navbar-link" style={{ fontWeight: '600' }}>🔐 Acceso Socio</a>
          <a href="/login" className="navbar-link" style={{ fontWeight: '600' }}>⚙️ Acceso Admin</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-vintage">
        <div className="hero-content">
          <span className="hero-badge">⚠️ URGENTE</span>
          <h1 className="hero-title">47 años de cultura en peligro</h1>
          <p className="hero-subtitle">
            La Tertulia, bar histórico de Granada (1977), está en riesgo de cierre.
            Los alquileres han subido un 40% y necesitamos tu ayuda.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-emergency" onClick={() => document.getElementById('unete').scrollIntoView({ behavior: 'smooth' })}>
              🍷 Salvar La Tertulia →
            </button>
            <button className="btn btn-outline" style={{ borderColor: '#FDFBF7', color: '#FDFBF7' }}>
              Leer Manifiesto
            </button>
          </div>
        </div>
      </section>

      {/* CONTADOR SOCIOS */}
      <section className="section" style={{ backgroundColor: 'var(--tinta)' }}>
        <div className="counter-widget" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1rem' }}>
            Progreso de Socios
          </h2>
          <div className="counter-number">{sociosCount}/{metaSocios}</div>
          <p className="counter-label">
            Necesitamos {metaSocios - sociosCount} socios más para garantizar la permanencia del bar
          </p>
          <div className="counter-progress">
            <div
              className="counter-progress-fill"
              style={{ width: `${(sociosCount / metaSocios) * 100}%` }}
            ></div>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
            Únete antes del 31 de marzo y participa en la asamblea constituyente
          </p>
        </div>
      </section>

      {/* MANIFIESTO */}
      <section id="manifiesto" className="section">
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 className="section-title">Nuestro Manifiesto</h2>
          <p className="section-subtitle">
            Por qué La Tertulia debe sobrevivir
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            marginTop: '3rem',
            alignItems: 'center'
          }}>
            <div style={{
              background: 'var(--papel)',
              borderLeft: '4px solid var(--corporativo)',
              padding: '2rem',
              lineHeight: '1.8'
            }}>
              <p style={{ marginBottom: '1.5rem' }}>
                <strong>La Tertulia abrió sus puertas en 1977</strong>, en plena Transición española.
                Desde entonces, ha sido testigo de innumerables historias: noviazgos que nacieron entre sus mesas,
                poemas escritos en servilletas, debates que duraron hasta el amanecer.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                No es solo un bar. Es un <strong>espacio cultural</strong> donde han actuado poetas,
                músicos flamencos, escritores locales. Es donde estudiantes, artistas, vecinos y turistas
                se han encontrado durante casi medio siglo.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                Pero la gentrificación de Granada no perdona. El alquiler ha subido un 40% en dos años.
                Los turistas prefieren las terrazas genéricas del Albayzín. La Tertulia está en peligro.
              </p>
              <p style={{ marginBottom: '0' }}>
                <strong>No vamos a dejar que cierre.</strong> Creamos "Amigos de La Tertulia",
                una asociación de socios que se convertirá en copropietaria del bar.
                Tu cuota mensual paga el alquiler, los sueldos del personal, y garantiza que
                La Tertulia siga viva para las próximas generaciones.
              </p>
            </div>

            <div style={{ position: 'relative' }}>
              <img
                src="/img/libros.jpg"
                alt="La biblioteca de La Tertulia"
                style={{
                  width: '100%',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '3px solid var(--oro)'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '-20px',
                right: '-20px',
                background: 'var(--oro)',
                color: 'var(--tinta)',
                padding: '1rem 1.5rem',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-display)',
                fontWeight: '600',
                boxShadow: 'var(--shadow-md)'
              }}>
                📚 47 años de cultura
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section id="beneficios" className="section" style={{ backgroundColor: 'var(--oro)', opacity: 0.1 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="section-title">Beneficios de ser Socio</h2>
          <p className="section-subtitle">
            Más que una cuota: una membresía con ventajas exclusivas
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginTop: '3rem'
          }}>
            {benefits.map((benefit, index) => (
              <div key={index} className="card-vintage benefit-card">
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  color: 'var(--corporativo)',
                  marginBottom: '1rem'
                }}>
                  {benefit.title}
                </h3>
                <p style={{ lineHeight: '1.8', color: 'var(--tinta)' }}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIPOS DE SOCIO */}
      <section id="unete" className="section">
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 className="section-title">Hazte Socio</h2>
          <p className="section-subtitle">
            Elige tu tipo de membresía. Todas incluyen carnet digital y voto en asamblea.
          </p>

          {/* Billing Period Toggle */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '2rem',
            marginBottom: '2rem'
          }}>
            <button
              onClick={() => setBillingPeriod('monthly')}
              style={{
                padding: '0.75rem 2rem',
                border: `2px solid ${billingPeriod === 'monthly' ? 'var(--corporativo)' : 'var(--oro)'}`,
                background: billingPeriod === 'monthly' ? 'var(--corporativo)' : 'transparent',
                color: billingPeriod === 'monthly' ? 'var(--papel)' : 'var(--tinta)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'var(--transition)'
              }}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              style={{
                padding: '0.75rem 2rem',
                border: `2px solid ${billingPeriod === 'yearly' ? 'var(--corporativo)' : 'var(--oro)'}`,
                background: billingPeriod === 'yearly' ? 'var(--corporativo)' : 'transparent',
                color: billingPeriod === 'yearly' ? 'var(--papel)' : 'var(--tinta)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'var(--transition)'
              }}
            >
              Anual <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>(Ahorras 2 meses)</span>
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginTop: '2rem'
          }}>
            {memberships.map((membership, index) => (
              <div
                key={index}
                className={`membership-card ${membership.featured ? 'featured' : ''}`}
              >
                <h3 className="membership-title">{membership.name}</h3>
                <div className="membership-price">
                  {billingPeriod === 'monthly' ? membership.priceMonthly : membership.priceYearly}
                  <span>€/{billingPeriod === 'monthly' ? 'mes' : 'año'}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--tinta)', opacity: 0.7 }}>
                  {billingPeriod === 'monthly'
                    ? `o ${membership.priceYearly}€/año (ahorras 2 meses)`
                    : `${membership.priceMonthly}€/mes disponible`
                  }
                </p>

                <ul className="membership-benefits">
                  {membership.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>

                <button
                  className={`btn ${membership.featured ? 'btn-primary' : 'btn-outline'}`}
                  style={{ width: '100%', marginTop: '1.5rem' }}
                  onClick={() => handleJoin(membership, billingPeriod)}
                >
                  {membership.featured ? '⭐ Más Popular' : 'Hazte Socio'}
                </button>
              </div>
            ))}
          </div>

          <p style={{
            textAlign: 'center',
            marginTop: '2rem',
            fontSize: '0.9rem',
            color: 'var(--tinta)',
            opacity: 0.8
          }}>
            💳 Pagos seguros a través de Stripe. Cancela cuando quieras.
          </p>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="section" style={{ backgroundColor: 'var(--oro)', opacity: 0.1 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="section-title">Lo que dicen nuestros socios</h2>
          <p className="section-subtitle">
            Historias reales de quienes ya forman parte de La Tertulia
          </p>

          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <p style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.8',
                  fontStyle: 'italic',
                  marginBottom: '1.5rem'
                }}>
                  {testimonial.text}
                </p>
                <div className="testimonial-author">
                  <div>{testimonial.author}</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-symbol">🍷</div>
        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>
          Amigos de La Tertulia
        </h3>
        <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
          Salvando 47 años de cultura en Granada
        </p>

        <div className="footer-links">
          <a href="#" className="footer-link">Términos y Condiciones</a>
          <a href="#" className="footer-link">Política de Privacidad</a>
          <a href="#" className="footer-link">Contacto</a>
        </div>

        <p style={{ marginTop: '2rem', fontSize: '0.85rem', opacity: 0.6 }}>
          © 2026 Amigos de La Tertulia. Asociación Cultural registrada en Granada.
        </p>
      </footer>
    </div>
  )
}

export default Landing
