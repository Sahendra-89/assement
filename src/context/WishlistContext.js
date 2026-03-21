'use client';
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const WishlistContext = createContext(null);

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.payload, hydrated: true };

    case 'TOGGLE': {
      const exists = state.items.some(i => i.id === action.payload.id);
      return {
        ...state,
        items: exists
          ? state.items.filter(i => i.id !== action.payload.id)
          : [...state.items, action.payload],
      };
    }

    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };

    default:
      return state;
  }
};

export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [], hydrated: false });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('wishlist');
      dispatch({ type: 'HYDRATE', payload: stored ? JSON.parse(stored) : [] });
    } catch {
      dispatch({ type: 'HYDRATE', payload: [] });
    }
  }, []);

  useEffect(() => {
    if (state.hydrated) {
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    }
  }, [state.items, state.hydrated]);

  const toggleWishlist = useCallback((product) => dispatch({ type: 'TOGGLE', payload: product }), []);
  const removeFromWishlist = useCallback((id) => dispatch({ type: 'REMOVE', payload: id }), []);
  const isWishlisted = useCallback((id) => state.items.some(i => i.id === id), [state.items]);

  return (
    <WishlistContext.Provider value={{
      items: state.items,
      hydrated: state.hydrated,
      toggleWishlist,
      removeFromWishlist,
      isWishlisted,
      count: state.items.length,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be inside WishlistProvider');
  return ctx;
}
