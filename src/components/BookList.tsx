import React, { useState, useEffect } from 'react';
import BooksApi from '../utils/BooksApi';
import { Book, UserData, AddBook } from '../components/types/types';
import AddBookModal from './AddBookModal';

interface BookListProps {
  userData: UserData | null;
}

const BookList: React.FC<BookListProps> = ({ userData }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await BooksApi.fetchBooks();
        console.log('Fetched books:', response);
        setBooks(response);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      }
    };

    fetchBooks();
  }, []);

  const handleAddBook = async (book: AddBook) => {
    try {
      // Make a POST request to add the new book
      const newBook = await BooksApi.createBook(book);

      // Add the returned book to the books array
      setBooks([...books, newBook]);

      // Close the modal
      setModalOpen(false);
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  };

  return (
    <div className="flex flex-col items-left bg-gray-100 m-0 p-0">
      {userData?.roles.some(role => role.name === 'Librarian') && (
        <div className="toolbar p-2">
          <button
            className="px-2 py-1 text-sm bg-blue-500 text-white rounded"
            onClick={() => setModalOpen(true)}
          >
            Add new book
          </button>
        </div>
      )}
      <AddBookModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onAddBook={handleAddBook} />
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISBN</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copies available</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {books.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 whitespace-nowrap">No books available.</td>
            </tr>
          ) : (
            books.map((book) => (
              <tr key={book.id}>
                <td className="px-6 py-4 whitespace-nowrap">{book.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{book.author}</td>
                <td className="px-6 py-4 whitespace-nowrap">{book.genre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{book.isbn}</td>
                <td className="px-6 py-4 whitespace-nowrap">{book.copies_available}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookList;