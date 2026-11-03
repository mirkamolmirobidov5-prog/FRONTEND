import { AlertTriangle, DollarSign, Package, ShoppingBag, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api, formatPrice } from '../api/client.js'
import EmptyState from '../components/EmptyState.jsx'
import Loading from '../components/Loading.jsx'

function Stat({ icon: Icon, label, value, tone = 'primary' }) {
  const tones = { primary: 'bg-primary-50 text-primary-700', green: 'bg-emerald-50 text-emerald-700', amber: 'bg-amber-50 text-amber-700' }
  return (
    <div className="card flex items-center gap-3 p-4">
      <div className={`rounded-lg p-2.5 ${tones[tone]}`}><Icon size={20} /></div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  )
}

function Bars({ rows, labelKey, valueKey, format }) {
  const max = Math.max(...rows.map((r) => r[valueKey]), 1)
  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r[labelKey]}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="truncate pr-2">{r[labelKey]}</span>
            <span className="font-medium">{format(r[valueKey])}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-primary-500" style={{ width: `${(r[valueKey] / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function StatsPage() {
  const [s, setS] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getStatistics().then((r) => setS(r.data)).catch((e) => setError(e.message))
  }, [])

  if (error) return <EmptyState title="Xatolik" hint={error} />
  if (!s) return <Loading />

  const maxDay = Math.max(...s.dailySales.map((d) => d.revenue), 1)

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">Savdo statistikasi</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={DollarSign} tone="green" label="Jami daromad" value={formatPrice(s.totalRevenue)} />
        <Stat icon={ShoppingBag} label="Buyurtmalar" value={s.totalOrders} />
        <Stat icon={TrendingUp} label="O'rtacha chek" value={formatPrice(s.avgOrderValue)} />
        <Stat icon={Package} label="Mahsulotlar" value={s.totalProducts} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Stat icon={AlertTriangle} tone="amber" label="Tugayotgan (≤5)" value={s.lowStock} />
        <Stat icon={AlertTriangle} tone="amber" label="Tugagan" value={s.outOfStock} />
        <Stat icon={Package} label="Ombor qiymati" value={formatPrice(s.inventoryValue)} />
      </div>

      <div className="card mt-6 p-5">
        <h2 className="mb-4 font-semibold">Oxirgi 30 kun savdosi</h2>
        {s.dailySales.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">Hali savdo yo'q</p>
        ) : (
          <div className="flex h-44 items-end gap-1.5 overflow-x-auto">
            {s.dailySales.map((d) => (
              <div key={d.date} className="group flex h-full min-w-[22px] flex-1 flex-col justify-end" title={`${d.date}: ${formatPrice(d.revenue)} (${d.orders} ta)`}>
                <div className="rounded-t bg-primary-500 transition group-hover:bg-primary-700" style={{ height: `${Math.max((d.revenue / maxDay) * 100, 3)}%` }} />
                <span className="mt-1 text-center text-[10px] text-slate-400">{d.date.slice(8)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-4 font-semibold">Top mahsulotlar (sotilgan soni)</h2>
          {s.topProducts.length ? <Bars rows={s.topProducts} labelKey="name" valueKey="quantitySold" format={(v) => `${v} ta`} /> : <p className="text-sm text-slate-500">Ma'lumot yo'q</p>}
        </div>
        <div className="card p-5">
          <h2 className="mb-4 font-semibold">Kategoriya bo'yicha daromad</h2>
          {s.revenueByCategory.length ? <Bars rows={s.revenueByCategory} labelKey="category" valueKey="revenue" format={formatPrice} /> : <p className="text-sm text-slate-500">Ma'lumot yo'q</p>}
        </div>
      </div>
    </div>
  )
}
