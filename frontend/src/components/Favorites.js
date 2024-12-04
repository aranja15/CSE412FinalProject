// src/components/Favorites.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Favorites({ userId, logout }) {
  const [favoritesList, setFavoritesList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/favorites', {
        params: { userId },
      });
      setFavoritesList(response.data);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const removeFavorite = async (restaurantId) => {
    try {
      await axios.delete('http://localhost:8000/api/favorites', {
        data: { userId, restaurantId },
      });
      setFavoritesList((prev) => prev.filter((fav) => fav.restaurantid !== restaurantId));
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  return (
    <div>
      <h2>Your Favorites</h2>
      {/* Logout Button */}
      <button onClick={logout}>Logout</button>
      {favoritesList.length > 0 ? (
        <ul>
          {favoritesList.map((restaurant) => (
            <li key={restaurant.restaurantid}>
              <strong>{restaurant.rname}</strong> - {restaurant.cuisinename} - {restaurant.pricerange}
              <br />
              Atmosphere: {restaurant.atmosphere}
              <br />
              Rating: {restaurant.averagerating}
              <br />
              Address: {restaurant.address}
              <br />
              Website:{' '}
              <a
                href={ensureHttp(restaurant.websitelink)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {restaurant.websitelink}
              </a>
              <br />
              {/* Remove Favorite Button */}
              <button onClick={() => removeFavorite(restaurant.restaurantid)}>
                Remove from Favorites
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no favorite restaurants.</p>
      )}
      {/* Back to Dashboard */}
      <button onClick={() => navigate('/')}>Back to Dashboard</button>
    </div>
  );
}

// Helper function to ensure the URL has a protocol
function ensureHttp(url) {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `http://${url}`;
}

export default Favorites;
