import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8000/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pos_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pos_token')
      localStorage.removeItem('pos_user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api

export const authService = {
  login: (email, password) =>
    api.post('/login', { email, password }),

  logout: () =>
    api.post('/logout'),

  me: () =>
    api.get('/me'),
}

export const produkService = {
  getAll: (params = {}) =>
    api.get('/produk', { params }),

  getById: (sku) =>
    api.get(`/produk/${sku}`),

  create: (data) =>
    api.post('/produk', data),

  update: (sku, data) =>
    api.put(`/produk/${sku}`, data),

  delete: (sku) =>
    api.delete(`/produk/${sku}`),

  updateStok: (sku, data) =>
    api.put(`/produk/${sku}/stok`, data),
}

export const kategoriService = {
  getAll: () =>
    api.get('/kategori'),
}

export const memberService = {
  getAll: (params = {}) =>
    api.get('/member', { params }),

  getById: (idMember) =>
    api.get(`/member/${idMember}`),

  create: (data) =>
    api.post('/member', data),

  update: (idMember, data) =>
    api.put(`/member/${idMember}`, data),

  deactivate: (idMember) =>
    api.delete(`/member/${idMember}`),
}

export const transaksiService = {
  getAll: (params = {}) =>
    api.get('/transaksi', { params }),

  getById: (noTransaksi) =>
    api.get(`/transaksi/${noTransaksi}`),

  create: (data) =>
    api.post('/transaksi', data),

  batal: (noTransaksi) =>
    api.put(`/transaksi/${noTransaksi}/batal`),
}

export const dashboardService = {
  get: (params = {}) =>
    api.get('/dashboard', { params }),
}

export const laporanService = {
  get: (params = {}) =>
    api.get('/laporan', { params }),
}

export const auditService = {
  getAll: (params = {}) =>
    api.get('/audit', { params }),

  getById: (id) =>
    api.get(`/audit/${id}`),

  create: (data) =>
    api.post('/audit', data),

  submitDetail: (id, items) =>
    api.post(`/audit/${id}/detail`, { items }),

  selesai: (id) =>
    api.put(`/audit/${id}/selesai`),

  batal: (id) =>
    api.put(`/audit/${id}/batal`),
}