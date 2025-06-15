
import React from 'react';
import { useLogout } from '../../utils/logout';

function Logout() {
  const logout = useLogout();

  return <button onClick={logout}>Logout</button>;
}

export default Logout;
