import axios, { AxiosInstance } from 'axios';
import { Author, AuthorForm } from '../components/types/types';

interface AuthorsApiInstance extends AxiosInstance {
  fetchAuthors(): Promise<Author[]>;
  createAuthor(author: AuthorForm): Promise<Author>;
}

interface ApiResponse {
  data: {
    id: string;
    type: string;
    attributes: Author;
  };
}

interface ApiResponseArray {
  data: {
    id: string;
    type: string;
    attributes: Author;
  }[];
}

const AuthorsApi = axios.create({
  baseURL: 'http://localhost:3001/api/v1/authors',
}) as AuthorsApiInstance;

AuthorsApi.interceptors.request.use(
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

AuthorsApi.fetchAuthors = async () => {
  const response = await AuthorsApi.get<ApiResponseArray>('');
  return response.data.data.map(author => author.attributes);
};

AuthorsApi.createAuthor = async (author: AuthorForm) => {
  const response = await AuthorsApi.post<ApiResponse>('', { author });
  if (!response.data) {
    throw new Error('Failed to create author');
  }
  return response.data.data.attributes;
};

export default AuthorsApi;