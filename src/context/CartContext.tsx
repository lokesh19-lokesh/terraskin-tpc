import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction = 
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}>({
  state: { items: [], total: 0, itemCount: 0 },
  dispatch: () => null
});

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        
        return { items: updatedItems, total, itemCount };
      }
      
      const newItems = [...state.items, { ...action.payload, quantity: 1 }];
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { items: newItems, total, itemCount };
    }
    
    case 'REMOVE_FROM_CART': {
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      const total = filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = filteredItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { items: filteredItems, total, itemCount };
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { items: updatedItems, total, itemCount };
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 };
    
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0, itemCount: 0 });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      parsedCart.items.forEach((item: CartItem) => {
        dispatch({ type: 'ADD_TO_CART', payload: item });
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};