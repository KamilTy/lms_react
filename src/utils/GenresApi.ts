import axios, { AxiosInstance } from 'axios';
import { Genre, GenreForm } from '../components/types/types';

interface GenresApiInstance extends AxiosInstance {
  fetchGenres(): Promise<Genre[]>;
  createGenre(genre: GenreForm): Promise<Genre>;
}

interface ApiResponse {
  data: {
    id: string;
    type: string;
    attributes: Genre;
  };
}

interface ApiResponseArray {
  data: {
    id: string;
    type: string;
    attributes: Genre;
  }[];
}

const GenresApi = axios.create({
  baseURL: 'http://localhost:3001/api/v1/genres',
}) as GenresApiInstance;

GenresApi.interceptors.request.use(
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

GenresApi.fetchGenres = async () => {
  const response = await GenresApi.get<ApiResponseArray>('');
  return response.data.data.map(genre => genre.attributes);
};

GenresApi.createGenre = async (genre: GenreForm) => {
  const response = await GenresApi.post<ApiResponse>('', { genre });
  if (!response.data) {
    throw new Error('Failed to create author');
  }
  return response.data.data.attributes;
};

export default GenresApi;