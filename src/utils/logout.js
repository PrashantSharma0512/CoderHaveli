// src/utils/auth.js
import { useNavigate } from 'react-router';
import axiosInstance from '../components/helper/axiosInstance';

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout'); // clear cookie
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return logout;
};
