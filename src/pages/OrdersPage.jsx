import { CheckCircle2, Minus, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api, formatPrice } from '../api/client.js'
import EmptyState from '../components/EmptyState.jsx'
import { useToast } from '../components/Toast.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function OrdersPage() {
  const { items, setQty, remove, clear, total } = useCart()
  const toast = useToast()
  const [customerName, setCustomerName] = useState('')
  const [sending, setSending] = useState(false)
  const [last, setLast] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      const res = await api.createOrder({
        customerName,
        items: items.map((i) => ({ product: i.product._id, quantity: i.quantity })),
      })
      setLast(res.data)
      clear()
      setCustomerName('')
      toast.success('Buyurtma muvaffaqiyatli yaratildi')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">Buyurtma</h1>

      {last && (
        <div className="card mb-5 border-emerald-200 bg-emerald-50 p-4">
          <p className="flex items-center gap-2 font-semibold text-emerald-700">
            <CheckCircle2 size={18} /> Buyurtma qabul qilindi — {last.customerName}
          </p>
          <ul className="mt-2 text-sm text-slate-700">
            {last.items.map((i) => (
              <li key={i.product?._id || i.name}>{i.name} × {i.quantity}</li>
            ))}
          </ul>
          <p className="mt-2 font-bold">Jami: {formatPrice(last.totalPrice)}</p>
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState
          title="Savat bo'sh"
          hint="Mahsulotlar sahifasidan mahsulot tanlang."
          action={<Link to="/" className="btn-primary">Mahsulotlarga o'tish</Link>}
        />
      ) : (
        <form onSubmit={submit} className="grid gap-5 lg:grid-cols-3">
          <div className="card divide-y divide-slate-100 lg:col-span-2">
            {items.map(({ product, quantity }) => (
              <div key={product._id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{product.name}</p>
                  <p className="text-sm text-slate-500">{formatPrice(product.price)} · omborda {product.stock} ta</p>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" className="btn-ghost !px-2" onClick={() => setQty(product._id, quantity - 1)} disabled={quantity <= 1}><Minus size={14} /></button>
                  <input
                    className="input w-14 text-center"
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQty(product._id, Number(e.target.value) || 1)}
                  />
                  <button type="button" className="btn-ghost !px-2" onClick={() => setQty(product._id, quantity + 1)} disabled={quantity >= product.stock}><Plus size={14} /></button>
                </div>
                <p className="w-32 text-right font-semibold">{formatPrice(product.price * quantity)}</p>
                <button type="button" className="rounded-lg p-2 text-red-500 hover:bg-red-50" onClick={() => remove(product._id)} aria-label="O'chirish">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="card h-fit p-4">
            <h2 className="mb-3 font-semibold">Buyurtma ma'lumotlari</h2>
            <input className="input" required placeholder="Mijoz ismi *" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            <div className="my-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-slate-500">Jami</span>
              <span className="text-xl font-bold text-primary-700">{formatPrice(total)}</span>
            </div>
            <button className="btn-primary w-full" disabled={sending}>{sending ? 'Yuborilmoqda...' : 'Buyurtma berish'}</button>
            <button type="button" className="btn-ghost mt-2 w-full" onClick={clear}>Savatni tozalash</button>
          </div>
        </form>
      )}
    </div>
  )
}
