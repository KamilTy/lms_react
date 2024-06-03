export interface UserData {
  id: number;
  email: string;
  name: string;
  roles: {
    name: string;
  }[];
}

export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  copies_available: number;
}

export interface AddBook {
  title: string;
  author_ids: number[];
  genre_id: number;
  isbn: string;
}

export interface Author {
  id: number;
  name: string;
}

export interface Genre {
  id: number;
  name: string;
}

export type BookForm = Omit<Book, 'id'>;
export type AuthorForm = Omit<Author, 'id'>;
export type GenreForm = Omit<Author, 'id'>;