// src/components/Dashboard.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard({ userId, logout }) {
  const [restaurants, setRestaurants] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    searchQuery: '',
    priceRange: '',
    // Add other filters as needed
  });

  useEffect(() => {
    fetchRestaurants();
  }, [filters]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/restaurants', {
        params: filters,
      });
      setRestaurants(response.data);
    } catch (err) {
      console.error('Error fetching restaurants:', err);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/favorites', {
        params: { userId },
      });
      const favoriteIds = new Set(response.data.map((fav) => fav.restaurantid));
      setFavorites(favoriteIds);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const toggleFavorite = async (restaurantId) => {
    if (favorites.has(restaurantId)) {
      // Remove from favorites
      try {
        await axios.delete('http://localhost:8000/api/favorites', {
          data: { userId, restaurantId },
        });
        setFavorites((prev) => {
          const newFavorites = new Set(prev);
          newFavorites.delete(restaurantId);
          return newFavorites;
        });
      } catch (err) {
        console.error('Error removing favorite:', err);
      }
    } else {
      // Add to favorites
      try {
        await axios.post('http://localhost:8000/api/favorites', {
          userId,
          restaurantId,
        });
        setFavorites((prev) => new Set(prev).add(restaurantId));
      } catch (err) {
        console.error('Error adding favorite:', err);
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h2>Welcome, User {userId}</h2>
      {/* Logout and View Favorites Buttons */}
      <button onClick={logout}>Logout</button>
      <button onClick={() => navigate('/favorites')}>View Favorites</button>
      {/* Filters and Search */}
      <div>
        <h3>Filters</h3>
        {/* General Search Bar */}
        <label>Search:</label>
        <input
          type="text"
          name="searchQuery"
          value={filters.searchQuery}
          onChange={handleFilterChange}
          placeholder="Search by restaurant or menu item..."
        />
        {/* Price Range Filter */}
        <label>Price Range:</label>
        <input
          type="text"
          name="priceRange"
          value={filters.priceRange}
          onChange={handleFilterChange}
          placeholder="e.g., $, $$, $$$"
        />
        {/* Add more filter inputs if needed */}
      </div>
      {/* Restaurant List */}
      <div>
        <h3>Restaurants</h3>
        {restaurants.length > 0 ? (
          <ul>
            {restaurants.map((restaurant) => (
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
                {/* Favorite Button */}
                <button onClick={() => toggleFavorite(restaurant.restaurantid)}>
                  {favorites.has(restaurant.restaurantid) ? 'Unfavorite' : 'Favorite'}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No restaurants found.</p>
        )}
      </div>
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

export default Dashboard;
