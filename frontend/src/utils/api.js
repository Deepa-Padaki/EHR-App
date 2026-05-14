import axios from 'axios'

// Use environment variable if available, otherwise use production URL
const API_URL = import.meta.env.VITE_API_URL || 'https://ehr-app-1.onrender.com/api'

console.log('=== API Configuration ===')
console.log('API_URL:', API_URL)
console.log('VITE_API_URL from env:', import.meta.env.VITE_API_URL)
console.log('========================')

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  console.error('Request error:', error)
  return Promise.reject(error)
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message)
    console.error('API Error URL:', error.config?.url)
    console.error('API Error Response:', error.response)
    return Promise.reject(error)
  }
)

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  login: async (credentials) => {
    const response = await api.post('/auth/authenticate', credentials)
    return response.data
  },

  getToken: () => {
    return localStorage.getItem('token')
  },

  getUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

export const appointmentService = {
  getAll: () => api.get('/appointments'),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  delete: (id) => api.delete(`/appointments/${id}`),
  getByPatient: (patientId) => api.get(`/appointments/patient/${patientId}`),
  getByDoctor: (doctorId) => api.get(`/appointments/doctor/${doctorId}`),
}

export const medicalRecordService = {
  getAll: () => api.get('/medical-records'),
  getById: (id) => api.get(`/medical-records/${id}`),
  create: (data) => api.post('/medical-records', data),
  update: (id, data) => api.put(`/medical-records/${id}`, data),
  delete: (id) => api.delete(`/medical-records/${id}`),
  getByPatient: (patientId) => api.get(`/medical-records/patient/${patientId}`),
  getByDoctor: (doctorId) => api.get(`/medical-records/doctor/${doctorId}`),
}

export const prescriptionService = {
  getAll: () => api.get('/prescriptions'),
  getById: (id) => api.get(`/prescriptions/${id}`),
  create: (data) => api.post('/prescriptions', data),
  update: (id, data) => api.put(`/prescriptions/${id}`, data),
  delete: (id) => api.delete(`/prescriptions/${id}`),
  getByPatient: (patientId) => api.get(`/prescriptions/patient/${patientId}`),
  getByDoctor: (doctorId) => api.get(`/prescriptions/doctor/${doctorId}`),
}

export const videoService = {
  generateRoom: () => api.post('/video/generate-room'),
  getRoom: (roomId) => api.get(`/video/room/${roomId}`),
  endRoom: (roomId) => api.post(`/video/end-room/${roomId}`),
}

export const doctorService = {
  getAll: () => api.get('/doctors'),
  getById: (id) => api.get(`/doctors/${id}`),
}

export const medicalReviewService = {
  create: (data) => api.post('/medical-reviews', data),
  getByDoctor: (doctorId) => api.get(`/medical-reviews/doctor/${doctorId}`),
  getByPatient: (patientId) => api.get(`/medical-reviews/patient/${patientId}`),
}

export default api
