import { Plus } from 'lucide-react'
import { formatPrice } from '../api/client.js'

export default function ProductCard({ product, inCart, onAdd }) {
  const out = !product.isInStock
  return (
    <div className="card flex flex-col p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">{product.category}</span>
        <span className="text-xs text-slate-400">{product.sku}</span>
      </div>
      <h3 className="font-semibold leading-snug">{product.name}</h3>
      {product.description && <p className="mt-1 line-clamp-2 text-sm text-slate-500">{product.description}</p>}
      <div className="mt-auto pt-4">
        <p className="text-lg font-bold text-primary-700">{formatPrice(product.price)}</p>
        <p className={`text-xs ${out ? 'text-red-600' : product.stock <= 5 ? 'text-amber-600' : 'text-slate-500'}`}>
          {out ? 'Omborda yo‘q' : `Omborda: ${product.stock} ta`}
        </p>
        <button className="btn-primary mt-3 w-full" disabled={out || inCart >= product.stock} onClick={() => onAdd(product)}>
          <Plus size={16} /> Savatga {inCart > 0 && `(${inCart})`}
        </button>
      </div>
    </div>
  )
}
