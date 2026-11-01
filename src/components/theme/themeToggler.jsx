import { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(() => 
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md hover:scale-105 active:scale-95 dark:from-amber-400 dark:to-yellow-500 dark:text-gray-950 dark:shadow-none border border-amber-300/40 dark:border-amber-400/30 transition-transform duration-150 cursor-pointer"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? <FiSun size={20} className="stroke-[2.5]" /> : <FiMoon size={20} className="stroke-[2.5]" />}
    </button>
  );
}
