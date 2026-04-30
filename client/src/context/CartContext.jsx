import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0, count: 0 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [], total: 0, count: 0 }); return; }
    try {
      const { data } = await api.get('/cart');
      setCart({ items: data.items, total: data.total, count: data.count });
    } catch (err) {
      console.error('fetchCart error', err);
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) { toast.error('Please login to add items to cart.'); return false; }
    setLoading(true);
    try {
      await api.post('/cart', { product_id: productId, quantity });
      await fetchCart();
      toast.success('Added to cart! 🛒');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartId, quantity) => {
    try {
      await api.put(`/cart/${cartId}`, { quantity });
      await fetchCart();
    } catch (err) {
      toast.error('Failed to update quantity.');
    }
  };

  const removeItem = async (cartId) => {
    try {
      await api.delete(`/cart/${cartId}`);
      await fetchCart();
      toast.success('Item removed from cart.');
    } catch (err) {
      toast.error('Failed to remove item.');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      setCart({ items: [], total: 0, count: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
