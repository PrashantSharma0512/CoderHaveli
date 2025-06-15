import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../components/helper/axiosInstance'

export const checkLogin = createAsyncThunk(
    'auth/checkLogin',
    async (credentials, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/api/auth/login', credentials);
            return response.data; // expected to contain user info including role
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);
const authSlice = createSlice({
    name: 'login',
    initialState: {
        isAuthenticated: false,
        role: null,
        loading: false,
        error: null,
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
                state.role = action.payload.role; // adjust this if your API returns role differently
            })
            .addCase(checkLogin.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.role = null;
                state.error = action.payload;
            });
    },
});


export default authSlice.reducer;