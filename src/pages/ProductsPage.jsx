import { ChevronLeft, ChevronRight, PlusCircle, Search } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client.js'
import EmptyState from '../components/EmptyState.jsx'
import Loading from '../components/Loading.jsx'
import Modal from '../components/Modal.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { useToast } from '../components/Toast.jsx'
import { useCart } from '../context/CartContext.jsx'

const emptyForm = { name: '', description: '', category: '', sku: '', price: '', stock: '' }

function useDebounced(value, ms = 400) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return v
}

export default function ProductsPage() {
  const toast = useToast()
  const cart = useCart()

  const [filters, setFilters] = useState({ search: '', category: '', minPrice: '', maxPrice: '', inStock: '', sort: '-createdAt' })
  const [page, setPage] = useState(1)
  const [data, setData] = useState({ data: [], meta: { page: 1, totalPages: 1, total: 0 } })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const debounced = useDebounced(filters)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setData(await api.getProducts({ ...debounced, page, limit: 12 }))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [debounced, page])

  useEffect(() => {
    load()
  }, [load])

  const setFilter = (k, v) => {
    setFilters((f) => ({ ...f, [k]: v }))
    setPage(1)
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.createProduct({ ...form, price: Number(form.price), stock: Number(form.stock) })
      toast.success("Mahsulot qo'shildi")
      setModal(false)
      setForm(emptyForm)
      load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const inCartQty = (id) => cart.items.find((i) => i.product._id === id)?.quantity || 0
  const { meta } = data

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Mahsulotlar</h1>
          <p className="text-sm text-slate-500">Jami: {meta.total} ta</p>
        </div>
        <button className="btn-primary" onClick={() => setModal(true)}>
          <PlusCircle size={16} /> Yangi mahsulot
        </button>
      </div>

      <div className="card mb-5 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6">
        <div className="relative lg:col-span-2">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input className="input pl-9" placeholder="Nomi, SKU, kategoriya..." value={filters.search} onChange={(e) => setFilter('search', e.target.value)} />
        </div>
        <input className="input" placeholder="Kategoriya" value={filters.category} onChange={(e) => setFilter('category', e.target.value)} />
        <input className="input" type="number" min="0" placeholder="Min narx" value={filters.minPrice} onChange={(e) => setFilter('minPrice', e.target.value)} />
        <input className="input" type="number" min="0" placeholder="Max narx" value={filters.maxPrice} onChange={(e) => setFilter('maxPrice', e.target.value)} />
        <select className="input" value={filters.inStock} onChange={(e) => setFilter('inStock', e.target.value)}>
          <option value="">Barchasi</option>
          <option value="true">Omborda bor</option>
          <option value="false">Tugagan</option>
        </select>
        <select className="input lg:col-span-2" value={filters.sort} onChange={(e) => setFilter('sort', e.target.value)}>
          <option value="-createdAt">Yangilari birinchi</option>
          <option value="price">Narx: arzondan qimmatga</option>
          <option value="-price">Narx: qimmatdan arzonga</option>
          <option value="name">Nomi: A → Z</option>
          <option value="-stock">Ombor: ko'pdan kamga</option>
        </select>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <EmptyState title="Xatolik" hint={error} action={<button className="btn-ghost" onClick={load}>Qayta urinish</button>} />
      ) : data.data.length === 0 ? (
        <EmptyState title="Mahsulot topilmadi" hint="Filtrlarni o'zgartiring yoki yangi mahsulot qo'shing." />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.data.map((p) => (
              <ProductCard key={p._id} product={p} inCart={inCartQty(p._id)} onAdd={(prod) => { cart.add(prod); toast.success(`"${prod.name}" savatga qo'shildi`) }} />
            ))}
          </div>
          {meta.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button className="btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft size={16} /></button>
              <span className="text-sm text-slate-600">{meta.page} / {meta.totalPages}</span>
              <button className="btn-ghost" disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight size={16} /></button>
            </div>
          )}
        </>
      )}

      <Modal open={modal} title="Yangi mahsulot" onClose={() => setModal(false)}>
        <form onSubmit={submit} className="grid gap-3">
          <input className="input" required placeholder="Nomi *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <textarea className="input" rows={2} placeholder="Tavsif" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <input className="input" required placeholder="Kategoriya *" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <input className="input" required placeholder="SKU *" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            <input className="input" required type="number" min="0" placeholder="Narx (so'm) *" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input className="input" required type="number" min="0" step="1" placeholder="Ombor soni *" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" className="btn-ghost" onClick={() => setModal(false)}>Bekor qilish</button>
            <button className="btn-primary" disabled={saving}>{saving ? 'Saqlanmoqda...' : 'Saqlash'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
