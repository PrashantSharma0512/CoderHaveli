import React from 'react';
import { useLogout } from '../../utils/logout';
import { FaSignOutAlt } from 'react-icons/fa';

function Logout() {
  const logout = useLogout();

  return (
    <button
      onClick={logout}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100 dark:bg-gray-800 text-amber-600 dark:text-indigo-400 hover:bg-amber-200 dark:hover:bg-gray-700 transition-colors duration-200"
      aria-label="Logout"
    >
      <FaSignOutAlt className="w-4 h-4" />
      <span>Logout</span>
    </button>
  );
}

export default Logout;