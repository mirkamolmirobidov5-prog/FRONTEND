import { BarChart3, Package, ShoppingCart, Store } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

const link = ({ isActive }) =>
  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100'
  }`

export default function Navbar() {
  const { count } = useCart()
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2 text-lg font-bold text-primary-700">
          <Store size={22} /> Smartbis Market
        </NavLink>
        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={link}>
            <Package size={16} /> <span className="hidden sm:inline">Mahsulotlar</span>
          </NavLink>
          <NavLink to="/orders" className={link}>
            <span className="relative flex items-center gap-2">
              <ShoppingCart size={16} /> <span className="hidden sm:inline">Buyurtma</span>
              {count > 0 && (
                <span className="absolute -right-3 -top-2 rounded-full bg-accent-500 px-1.5 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </span>
          </NavLink>
          <NavLink to="/stats" className={link}>
            <BarChart3 size={16} /> <span className="hidden sm:inline">Statistika</span>
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
