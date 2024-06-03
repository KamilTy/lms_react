import React from 'react';
import { UserData } from './types/types';
import { Link } from 'react-router-dom';

interface HomeProps {
  isLoggedIn: boolean;
  userData: UserData | null;
}

const Home: React.FC<HomeProps> = ({ isLoggedIn, userData }) => {
  return (
    <div className="container mx-auto mt-10">
      {isLoggedIn ? (
        <div>
          <h2 className="text-2xl font-bold mb-6">Welcome back, {userData?.name}!</h2>
          <p>You are logged in.</p>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-6">Welcome to our site!</h2>
          <p>Please <Link to="/login" className="text-blue-500 underline hover:text-blue-800">log in</Link> to continue.</p>
        </div>
      )}
    </div>
  );
};

export default Home;