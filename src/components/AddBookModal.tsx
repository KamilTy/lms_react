// AddBookModal.tsx
import React, { useState, useEffect } from 'react';
import { AddBook, Author, Genre } from '../components/types/types';
import AuthorsApi from '../utils/AuthorsApi';
import GenresApi from '../utils/GenresApi';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (book: AddBook) => void;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose, onAddBook }) => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState('new');
  const [selectedGenre, setSelectedGenre] = useState('new');
  const [newAuthor, setNewAuthor] = useState('');
  const [newGenre, setNewGenre] = useState('');
  const [title, setTitle] = useState('');
  const [isbn, setIsbn] = useState('');
  const [creatingNewAuthor, setCreatingNewAuthor] = useState(true);
  const [creatingNewGenre, setCreatingNewGenre] = useState(true);

  useEffect(() => {
    // Fetch authors and genres from the backend
    AuthorsApi.fetchAuthors().then(response => setAuthors(response));
    GenresApi.fetchGenres().then(response => setGenres(response));
  }, []);

  const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAuthor(e.target.value);
    setCreatingNewAuthor(e.target.value === 'new');
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(e.target.value);
    setCreatingNewGenre(e.target.value === 'new');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let authorId = Number(selectedAuthor);
    let genreId = Number(selectedGenre);

    // If a new author is entered, create them
    if (creatingNewAuthor) {
      const newAuthorResponse = await AuthorsApi.createAuthor({ name: newAuthor });
      authorId = newAuthorResponse.id;
    }

    // If a new genre is entered, create them
    if (creatingNewGenre) {
      const newGenreResponse = await GenresApi.createGenre({ name: newGenre });
      genreId = newGenreResponse.id;
    }

    onAddBook({
      title,
      author_ids: [authorId],
      genre_id: genreId,
      isbn
    });
  };

  return isOpen ? (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div
        className="bg-white p-6 max-w-md mx-auto rounded-xl shadow-md flex items-center space-x-4"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border border-gray-300 rounded" />
          <input type="text" value={isbn} onChange={e => setIsbn(e.target.value)} placeholder="ISBN" maxLength={13} className="w-full p-2 border border-gray-300 rounded" />
          <select value={selectedAuthor} onChange={handleAuthorChange} className="w-full p-2 border border-gray-300 rounded">
            <option value="new">&lt;create new author&gt;</option>
            {authors.map(author => <option value={author.id}>{author.name}</option>)}
          </select>
          {creatingNewAuthor && <input type="text" value={newAuthor} onChange={e => setNewAuthor(e.target.value)} placeholder="New author" className="w-full p-2 border border-gray-300 rounded" />}
          <select value={selectedGenre} onChange={handleGenreChange} className="w-full p-2 border border-gray-300 rounded">
            <option value="new">&lt;create new genre&gt;</option>
            {genres.map(genre => <option value={genre.id}>{genre.name}</option>)}
          </select>
          {creatingNewGenre && <input type="text" value={newGenre} onChange={e => setNewGenre(e.target.value)} placeholder="New genre" className="w-full p-2 border border-gray-300 rounded" />}
          <div className="flex justify-between">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add book</button>
            <button type="button" onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default AddBookModal;