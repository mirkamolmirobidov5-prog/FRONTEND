import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import StatsPage from './pages/StatsPage.jsx'

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
