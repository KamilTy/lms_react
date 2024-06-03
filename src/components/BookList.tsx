import React, { useState, useEffect } from 'react';
import BooksApi from '../utils/BooksApi';
import { Book, UserData, AddBook } from '../components/types/types';
import AddBookModal from './AddBookModal';
import { FaBook, FaPencilAlt, FaPlus, FaTimes } from 'react-icons/fa';

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
      const newBook = await BooksApi.createBook(book);
      setBooks([...books, newBook]);
      setModalOpen(false);
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  };

  const handleEditBook = (bookId: number) => {
    // TODO: Implement edit book functionality
    console.log(`Edit book with ID: ${bookId}`);
  };

  const handleDeleteBook = async (bookId: number) => {
    try {
      await BooksApi.deleteBook(bookId);
      setBooks(books.filter(book => book.id !== bookId));
    } catch (error) {
      console.error(`Failed to delete book with ID: ${bookId}`, error);
    }
  };

  const handleAddCopy = (bookId: number) => {
    // TODO: Implement add copy functionality
    console.log(`Add copy for book with ID: ${bookId}`);
  };

  const handleBorrowBook = (bookId: number) => {
    // TODO: Implement borrow book functionality
    console.log(`Borrow book with ID: ${bookId}`);
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                <td className="px-6 py-4 whitespace-nowrap">
                  {userData?.roles.some(role => role.name === 'Librarian') ? (
                    <div className="flex space-x-3">
                      <FaPlus title="Add Copy" onClick={() => handleAddCopy(book.id)} />
                      <FaPencilAlt title="Edit" onClick={() => handleEditBook(book.id)} />
                      <FaTimes title="Delete" onClick={() => handleDeleteBook(book.id)} />
                    </div>
                  ) : (
                    <FaBook title="Borrow" onClick={() => handleBorrowBook(book.id)} />
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookList;