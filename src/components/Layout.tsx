import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { UserData } from './types/types';

interface Props {
  children: React.ReactNode;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUserData: (userData: UserData | null) => void;
  userData: UserData | null;
}

const Layout: React.FC<Props> = ({ children, setIsLoggedIn, setUserData, userData }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      const expires_at = localStorage.getItem('token_expires_at');
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');

      if (!token || !userData) {
        console.log('No token or user data found');
        navigate('/login');
        return;
      }

      // Check if the token has expired
      const current_time = new Date().getTime() / 1000; // convert to seconds
      if (expires_at && current_time > Number(expires_at)) {
        console.log('Token has expired');
        setIsLoggedIn(false);
        setUserData(null);
        navigate('/login');
        return;
      }

      try {
        const response = await api.validateToken();
        if (response.data.success) {
          console.log('User is logged in');
          setIsLoggedIn(true);
          setUserData(userData);
        }
      } catch (error) {
        console.error('Not authenticated');
        navigate('/login');
      }
    };

    checkLoginStatus();
  }, [setIsLoggedIn, setUserData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const response = await api.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      console.log('User signed out');
      setIsLoggedIn(false);
      setUserData(null);
      setDropdownVisible(false);
      navigate('/');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/6 bg-gray-200 flex flex-col items-center pt-4">
        {/* Sidebar content */}
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/book_list">Books</Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-5/6">
        {/* Top Bar */}
        <div className="bg-gray-800 text-white py-4 px-6 flex justify-between">
          {/* App Logo or Title */}
          <h1 className="text-lg font-bold">Library Management System</h1>

          {/* User Info and Signout */}
          <div className="relative">
            {/* Display user name */}
            <div onClick={() => setDropdownVisible(!isDropdownVisible)}>
              {userData?.name}
              {userData?.roles && userData.roles.length > 0 && ` (${userData.roles.map(role => role.name).join(', ')})`}
            </div>
            {/* Dropdown for user options */}
            <div ref={dropdownRef} className={`absolute top-full right-0 bg-white shadow-md mt-1 py-2 w-48 rounded-md ${isDropdownVisible ? '' : 'hidden'}`}>
              <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-200">
                Sign out
              </button>
              {/* Add other user options */}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
