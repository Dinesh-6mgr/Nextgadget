import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchSettings = createAsyncThunk('settings/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/admin/settings');
    return data;
  } catch {
    return rejectWithValue(null); // fail silently, use defaults
  }
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    currencySymbol: '$',
    storeName: 'NextGadget',
    tagline: 'Future Tech, Right Now.',
    logoUrl: '',
    faviconUrl: '',
    supportEmail: '',
    supportPhone: '',
    address: '',
    instagram: '',
    twitter: '',
    facebook: '',
    whatsapp: '',
    taxRate: 0,
    freeShippingThreshold: 0,
    maintenanceMode: false,
    maintenanceMessage: '',
    loaded: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSettings.fulfilled, (state, action) => {
      if (action.payload) Object.assign(state, action.payload, { loaded: true });
    });
  },
});

export default settingsSlice.reducer;
