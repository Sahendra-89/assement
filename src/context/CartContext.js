'use client';
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.payload, hydrated: true };

    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.id !== action.payload.id) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], hydrated: false });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cart');
      dispatch({ type: 'HYDRATE', payload: stored ? JSON.parse(stored) : [] });
    } catch {
      dispatch({ type: 'HYDRATE', payload: [] });
    }
  }, []);

  useEffect(() => {
    if (state.hydrated) {
      localStorage.setItem('cart', JSON.stringify(state.items));
    }
  }, [state.items, state.hydrated]);

  const addToCart = useCallback((product) => dispatch({ type: 'ADD_ITEM', payload: product }), []);
  const removeFromCart = useCallback((id) => dispatch({ type: 'REMOVE_ITEM', payload: id }), []);
  const updateQuantity = useCallback((id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);

  const isInCart = useCallback((id) => state.items.some(i => i.id === id), [state.items]);
  const getQuantity = useCallback((id) => state.items.find(i => i.id === id)?.quantity || 0, [state.items]);

  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const shipping = subtotal > 0 ? (subtotal > 50 ? 0 : 4.99) : 0;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider value={{
      items: state.items,
      hydrated: state.hydrated,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart,
      getQuantity,
      subtotal,
      shipping,
      total,
      itemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
} 
