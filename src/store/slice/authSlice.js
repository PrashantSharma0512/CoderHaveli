import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../components/helper/axiosInstance';

export const checkLogin = createAsyncThunk(
  'auth/checkLogin',
  async (credentials, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', credentials);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/api/auth/refresh-token', {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Session expired');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    accessToken: null,
    role: null,
    userId: null,
    loading: false,
    error: null,
    initialized: false
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.role = null;
      state.userId = null;
      state.error = null;
      setInitialized: (state) => {
        state.initialized = true;
      }
    },
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        state.role = action.payload.user.role;
        state.userId = action.payload.user.id;
      })
      .addCase(checkLogin.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        state.role = action.payload.user.role;
        state.userId = action.payload.user.id;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.role = null;
        state.userId = null;
        state.error = action.payload;
      });
  }
});

export const { logout, updateAccessToken } = authSlice.actions;
export default authSlice.reducer;