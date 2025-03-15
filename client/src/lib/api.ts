import axios, { AxiosError } from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // if (error.response?.status === 401) {
    //   // Handle unauthorized access
    //   clearStoredAuth();
    //   window.location.href = '/login';
    // }
    console.error('API Error:', error.response?.data); // Logging for verification
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  console.log('LoginFB:',response.data)
  return response.data;
};

export const register = async (name: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { name, email, password });
  console.log('register:',response)
  return response.data;
};

export const verifyToken = async (token: string) => {
  const response = await api.post('/auth/verify', { token });
  console.log('token verified:',response)
  return response.data;
};

export const createForm = async (productData: any) => {
  const response = await api.post('/admin/form', productData);
  return response.data;
};
export const deleteForm = async (productData: any) => {
  const response = await api.delete('/admin/form', productData);
  return response.data;
};

export const updateForm = async (formId: string, productData: any) => {
  const response = await api.put(`/admin/form/${formId}`, productData);
  return response.data;
};

export default api;