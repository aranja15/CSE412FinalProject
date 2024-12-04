// src/components/Dashboard.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Button, 
  Card, 
  Container, 
  Row, 
  Col, 
  Form, 
  Navbar, 
  Nav 
} from 'react-bootstrap';
import { HeartFill, Heart } from 'react-bootstrap-icons';

function Dashboard({ userId, username, logout }) {
  const [restaurants, setRestaurants] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    searchQuery: '',
    priceRange: '',
  });

  useEffect(() => {
    fetchRestaurants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const priceRanges = ['$', '$$', '$$$', '$$$$'];
  console.log('Dashboard received username:', username);
  return (
    <div>
      {/* Navigation Bar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>Restaurant Finder</Navbar.Brand>
          <Nav className="ml-auto">
            <Button
              variant="outline-light"
              onClick={() => navigate('/favorites')}
              className="mr-2"
            >
              Favorites
            </Button>
            <Button variant="outline-light" onClick={logout}>
              Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="mt-4">
        {/* Welcome Message */}
        <h2 className="mb-4 text-center">Welcome, {username}</h2>

        {/* Filters */}
        <Form className="mb-4">
          <Row className="justify-content-center">
            <Col md={6}>
              <Form.Group controlId="searchQuery">
                <Form.Control
                  type="text"
                  name="searchQuery"
                  value={filters.searchQuery}
                  onChange={handleFilterChange}
                  placeholder="Search by restaurant or menu item..."
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="priceRange">
                <Form.Control
                  as="select"
                  name="priceRange"
                  value={filters.priceRange}
                  onChange={handleFilterChange}
                >
                  <option value="">Select Price Range</option>
                  {priceRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
        </Form>

        {/* Restaurant Listings */}
        {restaurants.length > 0 ? (
          <Row>
            {restaurants.map((restaurant) => (
              <Col md={4} key={restaurant.restaurantid} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title className="d-flex justify-content-between align-items-center">
                      {restaurant.rname}
                      <Button
                        variant="link"
                        onClick={() => toggleFavorite(restaurant.restaurantid)}
                      >
                        {favorites.has(restaurant.restaurantid) ? (
                          <HeartFill color="red" size={24} />
                        ) : (
                          <Heart color="black" size={24} />
                        )}
                      </Button>
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {restaurant.cuisinename} - {restaurant.pricerange}
                    </Card.Subtitle>
                    <Card.Text>
                      <strong>Atmosphere:</strong> {restaurant.atmosphere}
                      <br />
                      <strong>Rating:</strong> {restaurant.averagerating}
                      <br />
                      <strong>Address:</strong> {restaurant.address}
                      <br />
                      <strong>Website:</strong>{' '}
                      <a
                        href={ensureHttp(restaurant.websitelink)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {restaurant.websitelink}
                      </a>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p>No restaurants found.</p>
        )}
      </Container>
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
