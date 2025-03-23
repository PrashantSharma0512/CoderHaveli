import { configureStore } from '@reduxjs/toolkit';
import coderHaveli from './slice'; // Ensure the correct path

export const store = configureStore({
  reducer: {
    code: coderHaveli,
  },
});

