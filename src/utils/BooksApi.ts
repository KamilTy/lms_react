import axios, { AxiosInstance } from 'axios';
import { Book, BookForm, AddBook } from '../components/types/types';

interface BooksApiInstance extends AxiosInstance {
  fetchBooks(): Promise<Book[]>;
  createBook(book: AddBook): Promise<Book>;
  updateBook(id: number, book: Book): Promise<any>;
  deleteBook(id: number): Promise<any>;
}

interface ApiResponse {
  data: {
    id: string;
    type: string;
    attributes: Book;
  };
}

interface ApiResponseArray {
  data: {
    id: string;
    type: string;
    attributes: Book;
  }[];
}


const BooksApi = axios.create({
  baseURL: 'http://localhost:3001/api/v1/books',
}) as BooksApiInstance;

BooksApi.interceptors.request.use(
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

BooksApi.fetchBooks = async () => {
  const response = await BooksApi.get<ApiResponseArray>('');
  return response.data.data.map(book => book.attributes);
};

BooksApi.createBook = async (book: AddBook) => {
  const response = await BooksApi.post<ApiResponse>('', { book });
  if (!response.data) {
    throw new Error('Failed to create book');
  }
  return response.data.data.attributes;
};

BooksApi.updateBook = async (id: number, book: BookForm) => {
  return await BooksApi.put(`/${id}`, { book });
};

BooksApi.deleteBook = async (id: number) => {
  return await BooksApi.delete(`/${id}`);
};

export default BooksApi;