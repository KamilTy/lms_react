import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import { UserData } from './components/types/types';
import BookList from './components/BookList';

const App: React.FC = () => {
  const [key, setKey] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  return (
    <Router>
      <Layout setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} userData={userData}>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home isLoggedIn={isLoggedIn} userData={userData} />} />
            <Route path="/login" element={<Login setKey={setKey} setIsLoggedIn={setIsLoggedIn} setUserData={setUserData}/>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/book_list" element={<BookList userData={userData} />} />
          </Routes>
        </div>
      </Layout>
    </Router>
  );
};

export default App;
