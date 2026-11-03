import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([]) // { product, quantity }

  const add = (product, quantity = 1) =>
    setItems((prev) => {
      const found = prev.find((i) => i.product._id === product._id)
      if (found) {
        return prev.map((i) =>
          i.product._id === product._id ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) } : i
        )
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }]
    })

  const setQty = (id, quantity) =>
    setItems((prev) =>
      prev.map((i) => (i.product._id === id ? { ...i, quantity: Math.max(1, Math.min(quantity, i.product.stock)) } : i))
    )

  const remove = (id) => setItems((prev) => prev.filter((i) => i.product._id !== id))
  const clear = () => setItems([])

  const value = useMemo(
    () => ({
      items,
      add,
      setQty,
      remove,
      clear,
      count: items.reduce((s, i) => s + i.quantity, 0),
      total: items.reduce((s, i) => s + i.quantity * i.product.price, 0),
    }),
    [items]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
