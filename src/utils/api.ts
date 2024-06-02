import axios, { AxiosInstance } from 'axios';

interface ApiInstance extends AxiosInstance {
  login(data: any): Promise<any>;
  signup(data: any): Promise<any>;
  validateToken(): Promise<any>;
  logout(): Promise<any>;
  get_user_role_types(): Promise<any>;
}

const api = axios.create({
  baseURL: 'http://localhost:3001',
}) as ApiInstance;

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.login = async (data) => {
  return await api.post('/auth/login', data);
};

api.signup = async (data) => {
  return await api.post('/auth/signup', data);
};

api.validateToken = async () => {
  return await api.get('/auth/validate_token');
};

api.logout = async () => {
  return await api.delete('/auth/logout');
};

api.get_user_role_types = async () => {
  return await api.get('/auth/get_user_role_types');
};

export default api;
