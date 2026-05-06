import axios from 'axios'

// Configuración base de axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para añadir el token JWT si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token')
      window.location.href = '/?expired=true'
    }
    return Promise.reject(error)
  }
)

/**
 * Auth API
 */
export const authAPI = {
  // Solicitar magic link
  requestLink: async (email) => {
    const response = await api.post('/auth/request-link', { email })
    return response.data
  },

  // Verificar magic link
  verifyToken: async (token) => {
    const response = await api.post('/auth/verify', { token })
    return response.data
  },

  // Obtener perfil de usuario
  getProfile: async () => {
    const response = await api.get('/auth/me')
    return response.data
  }
}

/**
 * Users API
 */
export const usersAPI = {
  // Obtener usuario actual
  getCurrent: async () => {
    const response = await api.get('/users/me')
    return response.data
  },

  // Actualizar perfil
  updateProfile: async (data) => {
    const response = await api.patch('/users/me', data)
    return response.data
  }
}

/**
 * Memberships API
 */
export const membershipsAPI = {
  // Obtener todos los tipos de membresía
  getAll: async () => {
    const response = await api.get('/memberships')
    return response.data
  },

  // Obtener una membresía por ID
  getById: async (id) => {
    const response = await api.get(`/memberships/${id}`)
    return response.data
  }
}

/**
 * Subscriptions API
 */
export const subscriptionsAPI = {
  // Obtener suscripciones del usuario
  getUserSubscriptions: async () => {
    const response = await api.get('/subscriptions')
    return response.data
  },

  // Obtener detalles de una suscripción
  getById: async (id) => {
    const response = await api.get(`/subscriptions/${id}`)
    return response.data
  },

  // Cancelar suscripción
  cancel: async (id) => {
    const response = await api.post(`/subscriptions/${id}/cancel`)
    return response.data
  }
}

/**
 * Events API
 */
export const eventsAPI = {
  // Obtener todos los eventos
  getAll: async () => {
    const response = await api.get('/events')
    return response.data
  },

  // Obtener un evento por ID
  getById: async (id) => {
    const response = await api.get(`/events/${id}`)
    return response.data
  },

  // Reservar plaza en evento
  reserve: async (eventId) => {
    const response = await api.post(`/events/${eventId}/reserve`)
    return response.data
  }
}

export default api
