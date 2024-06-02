import React, { useState } from 'react';
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
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const response = await api.logout();
      localStorage.removeItem('token');
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
            <div onClick={() => setDropdownVisible(!isDropdownVisible)}>{userData?.name}</div>
            {/* Dropdown for user options */}
            <div className={`absolute top-full right-0 bg-white shadow-md mt-1 py-2 w-48 rounded-md ${isDropdownVisible ? '' : 'hidden'}`}>
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
