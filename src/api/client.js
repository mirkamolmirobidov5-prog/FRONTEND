const BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1`

async function request(path, options = {}) {
  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new Error("Serverga ulanib bo'lmadi. Backend ishlayotganini tekshiring.")
  }
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message || `Xatolik (${res.status})`)
  return json
}

const toQuery = (params) => {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== '' && v !== undefined && v !== null) q.set(k, v)
  })
  const s = q.toString()
  return s ? `?${s}` : ''
}

export const api = {
  getProducts: (params = {}) => request(`/products${toQuery(params)}`),
  createProduct: (body) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
  createOrder: (body) => request('/orders', { method: 'POST', body: JSON.stringify(body) }),
  getStatistics: () => request('/statistics'),
}

export const formatPrice = (n) => `${new Intl.NumberFormat('uz-UZ').format(Math.round(n || 0))} so'm`
