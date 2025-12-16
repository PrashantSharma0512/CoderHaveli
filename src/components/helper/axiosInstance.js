import axios from 'axios';

let storeRef;

export const injectStore = (_store) => {
  storeRef = _store;
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    
  },
  withCredentials: true,
});

// Attach access token to request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = storeRef?.getState().login.accessToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-refresh token on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.get(`${BASE_URL}/api/auth/refresh-token`, {
          withCredentials: true,
        });

        const newAccessToken = res.data.accessToken;
  
        
        storeRef?.dispatch({ type: 'auth/updateAccessToken', payload: newAccessToken });

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        storeRef?.dispatch({ type: 'auth/logout' });
        // 🚫 Don't redirect here — AuthLayout will handle it
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
