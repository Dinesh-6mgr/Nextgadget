import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

// Fetch cart from backend
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/cart');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Add or update item in backend cart
export const addToCartAsync = createAsyncThunk('cart/addToCart', async (item, { rejectWithValue }) => {
  try {
    const payload = {
      productId: item._id,
      name: item.name,
      image: item.images?.[0] || item.image || '',
      price: item.price,
      countInStock: item.countInStock,
      qty: item.qty,
    };

    if (!payload.productId) {
      return rejectWithValue('Product ID is missing');
    }

    const { data } = await api.post('/cart', payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Add or update item in backend cart (no loading state for qty updates)
export const updateCartQty = createAsyncThunk('cart/updateQty', async (item, { rejectWithValue }) => {
  try {
    const payload = {
      productId: item._id,
      name: item.name,
      image: item.images?.[0] || item.image || '',
      price: item.price,
      countInStock: item.countInStock,
      qty: item.qty,
    };
    const { data } = await api.post('/cart', payload);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});
export const removeFromCartAsync = createAsyncThunk('cart/removeFromCart', async (productId, { rejectWithValue }) => {
  try {
    const { data } = await api.delete(`/cart/${productId}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// Clear entire cart
export const clearCartAsync = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    await api.delete('/cart');
    return [];
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const initialState = {
  cartItems: [],
  shippingAddress: localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {},
  paymentMethod: 'PayPal',
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    clearCartLocal: (state) => {
      state.cartItems = [];
    },
    updateQtyLocal: (state, action) => {
      const { _id, qty } = action.payload;
      const item = state.cartItems.find((i) => i._id === _id);
      if (item) item.qty = qty;
    },
    removeItemLocal: (state, action) => {
      state.cartItems = state.cartItems.filter((i) => i._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    const setItems = (state, action) => {
      state.loading = false;
      // Normalize: backend stores product as object after populate, map to flat shape
      state.cartItems = action.payload.map((item) => ({
        _id: item.product?._id || item.product,
        name: item.name,
        images: item.image ? [item.image] : [],
        price: item.price,
        countInStock: item.countInStock,
        qty: item.qty,
      }));
    };

    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCart.fulfilled, setItems)
      .addCase(fetchCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(addToCartAsync.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addToCartAsync.fulfilled, setItems)
      .addCase(addToCartAsync.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(removeFromCartAsync.pending, (state) => { state.error = null; })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.cartItems = action.payload.map((item) => ({
          _id: item.product?._id || item.product,
          name: item.name,
          images: item.image ? [item.image] : [],
          price: item.price,
          countInStock: item.countInStock,
          qty: item.qty,
        }));
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => { state.error = action.payload; })

      .addCase(clearCartAsync.fulfilled, (state) => { state.cartItems = []; state.loading = false; })
      .addCase(clearCartAsync.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // updateCartQty — silent background sync, no loading state
      .addCase(updateCartQty.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { saveShippingAddress, savePaymentMethod, clearCartLocal, updateQtyLocal, removeItemLocal } = cartSlice.actions;
export default cartSlice.reducer;
