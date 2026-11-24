'use client';

import { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const isDark =
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) ||
      document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!mounted) {
    return (
      <button
        type="button"
        aria-hidden="true"
        className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-amber-500 text-white opacity-0 pointer-events-none"
      >
        <span className="inline-block w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md hover:scale-105 active:scale-95 dark:from-amber-400 dark:to-yellow-500 dark:text-gray-950 dark:shadow-none border border-amber-300/40 dark:border-amber-400/30 transition-transform duration-150 cursor-pointer"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? <FiSun size={20} className="stroke-[2.5]" /> : <FiMoon size={20} className="stroke-[2.5]" />}
    </button>
  );
}
