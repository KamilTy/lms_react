import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';

interface UserData {
  id: number;
  email: string;
  name: string;
}

const App: React.FC = () => {
  const [key, setKey] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  return (
    <Router>
      <Layout setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} userData={userData}>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home key={key} isLoggedIn={isLoggedIn} setKey={setKey} setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} />} />
            <Route path="/login" element={<Login setKey={setKey} setIsLoggedIn={setIsLoggedIn} setUserData={setUserData}/>} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </Layout>
    </Router>
  );
};

export default App;
