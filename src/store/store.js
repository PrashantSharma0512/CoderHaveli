import { configureStore } from '@reduxjs/toolkit';
import coderHaveli from './slice/slice';
import authReducer from './slice/authSlice';
import { injectStore } from '../components/helper/axiosInstance';

const store = configureStore({
  reducer: {
    login: authReducer,
    code: coderHaveli,
  },
});

injectStore(store);

export default store;
