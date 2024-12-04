// src/App.js

import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Favorites from './components/Favorites';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [userId, setUserId] = useState(null);

  // Logout function to reset userId
  const logout = () => {
    setUserId(null);
  };

  if (!userId) {
    return <Login setUserId={setUserId} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard userId={userId} logout={logout} />} />
        <Route path="/favorites" element={<Favorites userId={userId} logout={logout} />} />
      </Routes>
    </Router>
  );
}

export default App;
