// src/App.js

import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Favorites from './components/Favorites';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(''); // New state for username

  const logout = () => {
    setUserId(null);
    setUsername('');
  };

  return (
    <Router>
      {userId ? (
        <Routes>
          <Route
            path="/"
            element={<Dashboard userId={userId} username={username} logout={logout} />}
          />
          <Route
            path="/favorites"
            element={<Favorites userId={userId} username={username} logout={logout} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <Routes>
          <Route
            path="*"
            element={<Login setUserId={setUserId} setUsername={setUsername} />}
          />
        </Routes>
      )}
    </Router>
  );
}

export default App;
