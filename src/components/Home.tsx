import React, { useEffect } from 'react';
import api from '../utils/api';
import Login from './Login';
import { UserData } from './types/types';

interface HomeProps {
  isLoggedIn: boolean;
  setKey: (key: number) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUserData: (userData: UserData) => void;
}

const Home: React.FC<HomeProps> = ({ isLoggedIn, setKey, setIsLoggedIn, setUserData }) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.log('No token found');
        return;
      }

      try {
        const response = await api.validateToken();
        if (response.data.success) {
          console.log('User is logged in');
        }
      } catch (error) {
        console.error('Not authenticated');
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <div className="container mx-auto mt-10">
      {isLoggedIn ? (
        <div>
          <h2 className="text-2xl font-bold mb-6">Welcome back!</h2>
          <p>You are logged in.</p>
        </div>
      ) : (
        <Login setKey={setKey} setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} />
      )}
    </div>
  );
};

export default Home;