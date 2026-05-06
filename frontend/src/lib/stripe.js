import { loadStripe } from '@stripe/stripe-js'

// Stripe publishable key from environment
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder')

/**
 * Crea una sesión de checkout de Stripe para una membresía
 * @param {string} membershipId - ID de la membresía (joven, colaborador, protector)
 * @param {string} billingPeriod - 'monthly' o 'yearly'
 * @param {string} email - Email del usuario (opcional)
 * @returns {Promise<string>} URL de checkout
 */
export async function createCheckoutSession(membershipId, billingPeriod = 'monthly', email = null) {
  try {
    // Obtener email del localStorage si no se proporciona
    if (!email) {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        email = user.email
      }
    }

    if (!email) {
      throw new Error('Se requiere email para crear sesión de checkout')
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/stripe/create-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        membership_id: membershipId,
        billing_period: billingPeriod,
        email: email
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Error al crear sesión de checkout')
    }

    const { checkout_url } = await response.json()

    // Redirigir a Stripe Checkout
    window.location.href = checkout_url
  } catch (error) {
    console.error('Error en checkout:', error)
    throw error
  }
}

/**
 * Verifica el estado de una sesión de checkout
 * @param {string} sessionId - ID de la sesión de Stripe
 * @returns {Promise<Object>} Datos de la sesión
 */
export async function getCheckoutSession(sessionId) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/stripe/session/${sessionId}`)

    if (!response.ok) {
      throw new Error('Error al obtener sesión')
    }

    return await response.json()
  } catch (error) {
    console.error('Error al obtener sesión:', error)
    throw error
  }
}

/**
 * Obtiene las suscripciones de un usuario
 * @param {string} token - JWT token del usuario
 * @returns {Promise<Array>} Lista de suscripciones
 */
export async function getUserSubscriptions(token) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/subscriptions`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Error al obtener suscripciones')
    }

    return await response.json()
  } catch (error) {
    console.error('Error al obtener suscripciones:', error)
    throw error
  }
}

/**
 * Cancela una suscripción activa
 * @param {string} subscriptionId - ID de la suscripción
 * @param {string} token - JWT token del usuario
 * @returns {Promise<Object>} Respuesta de cancelación
 */
export async function cancelSubscription(subscriptionId, token) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Error al cancelar suscripción')
    }

    return await response.json()
  } catch (error) {
    console.error('Error al cancelar suscripción:', error)
    throw error
  }
}

export default stripePromise
