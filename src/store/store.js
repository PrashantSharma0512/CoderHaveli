import { configureStore } from '@reduxjs/toolkit';
import coderHaveli from './slice/slice'; // Ensure the correct path
import authReducer from './slice/authSlice'
export const store = configureStore({
  reducer: {
    code: coderHaveli,
    login:authReducer
  },
});

