import axios from 'axios'

// Base URL Laravel - sesuaikan kalau port berbeda
const BASE_URL = 'http://127.0.0.1:8000/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
})

// ─── Request Interceptor ───────────────────────────────────────
// Otomatis sisipkan token ke setiap request kalau ada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pos_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Response Interceptor ─────────────────────────────────────
// Tangkap error 401 (token expired/invalid) → redirect ke login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pos_token')
      localStorage.removeItem('pos_user')
      // Redirect ke login - sesuaikan dengan sistem navigasi kamu
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api


// ================================================================
// AUTH
// ================================================================
export const authService = {
  // Pakai token-based (Bearer token) — tidak butuh CSRF cookie
  // karena kita tidak pakai session/cookie untuk auth
  login: (email, password) =>
    api.post('/login', { email, password }),

  logout: () =>
    api.post('/logout'),

  me: () =>
    api.get('/me'),
}


// ================================================================
// PRODUK
// ================================================================
export const produkService = {
  getAll: (params = {}) =>
    api.get('/produk', { params }),
  // params bisa: { cabang_id, search, kategori_id }

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
  // data: { cabang_id, stok_saat_ini, minimum_stok }
}


// ================================================================
// KATEGORI
// ================================================================
export const kategoriService = {
  getAll: () =>
    api.get('/kategori'),
}


// ================================================================
// MEMBER
// ================================================================
export const memberService = {
  getAll: (params = {}) =>
    api.get('/member', { params }),
  // params bisa: { search, status }

  getById: (idMember) =>
    api.get(`/member/${idMember}`),

  create: (data) =>
    api.post('/member', data),

  update: (idMember, data) =>
    api.put(`/member/${idMember}`, data),

  deactivate: (idMember) =>
    api.delete(`/member/${idMember}`),
}


// ================================================================
// TRANSAKSI
// ================================================================
export const transaksiService = {
  getAll: (params = {}) =>
    api.get('/transaksi', { params }),
  // params bisa: { cabang_id, tanggal, limit }

  getById: (noTransaksi) =>
    api.get(`/transaksi/${noTransaksi}`),

  create: (data) =>
    api.post('/transaksi', data),
  // data: { metode_pembayaran, id_member, cabang_id, items: [...] }

  batal: (noTransaksi) =>
    api.put(`/transaksi/${noTransaksi}/batal`),
}


// ================================================================
// DASHBOARD
// ================================================================
export const dashboardService = {
  get: (params = {}) =>
    api.get('/dashboard', { params }),
  // params bisa: { cabang_id, tahun }
}


// ================================================================
// LAPORAN
// ================================================================
export const laporanService = {
  get: (params = {}) =>
    api.get('/laporan', { params }),
  // params bisa: { dari, sampai, cabang_id, tipe }
}


// ================================================================
// AUDIT STOK
// ================================================================
export const auditService = {
  getAll: (params = {}) =>
    api.get('/audit', { params }),

  getById: (id) =>
    api.get(`/audit/${id}`),

  create: (data) =>
    api.post('/audit', data),
  // data: { cabang_id, catatan }

  submitDetail: (id, items) =>
    api.post(`/audit/${id}/detail`, { items }),
  // items: [{ sku, stok_fisik, alasan }]

  selesai: (id) =>
    api.put(`/audit/${id}/selesai`),

  batal: (id) =>
    api.put(`/audit/${id}/batal`),
}