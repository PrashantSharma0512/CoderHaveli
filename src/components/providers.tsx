'use client';

import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from '../store/store';
import { checkAuth } from '../store/slice/authSlice';
import ThemeToggle from './theme/themeToggler';

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(checkAuth());

    // Apply dark theme on initial mount
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dispatch]);

  return <>{children}</>;
}

import 'katex/dist/katex.min.css';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        {children}
        <ThemeToggle />
        <Toaster position="top-right" />
      </AuthInitializer>
    </Provider>
  );
}

export default Providers;
