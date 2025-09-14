import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../components/helper/axiosInstance';

// Thunks
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const response = await axiosInstance.get('/api/cart');
  return response.data;
});

export const syncCart = createAsyncThunk('cart/syncCart', async (cartItems) => {
  const response = await axiosInstance.post('/api/cart/sync', { items: cartItems });
  return response.data;
});

// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
    lastSynced: null,
  },
  reducers: {
    addItem: (state, action) => {
      const { product, quantity } = action.payload;
      const index = state.items.findIndex(i => i.product._id === product._id);
      
      if (index > -1) {
        state.items[index].quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
    },
    removeItem: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(i => i.product._id !== productId);
    },
    clearCart: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.lastSynced = Date.now();
      })
      .addCase(syncCart.fulfilled, (state) => {
        state.lastSynced = Date.now();
      });
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
