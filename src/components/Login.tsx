import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { UserData } from './types/types';

interface LoginProps {
  setKey: (key: number) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUserData: (userData: UserData) => void;
}

const Login: React.FC<LoginProps> = ({ setKey, setIsLoggedIn, setUserData }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.login({
        user: { email, password },
      });
      const { token, token_expires_at, data: { user, roles } } = response.data;
      console.log('User logged in:', user);
      console.log('User roles:', roles);
      localStorage.setItem('token', token);
      localStorage.setItem('token_expires_at', token_expires_at);
      localStorage.setItem('userData', JSON.stringify({ ...user, roles: roles }));
      setKey(Date.now());
      setIsLoggedIn(true);
      setUserData({
        ...user,
        roles: roles,
      });
      navigate('/');
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account? <Link to="/signup" className="text-indigo-600 hover:text-indigo-500">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
