// src/components/Favorites.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import { HeartFill } from 'react-bootstrap-icons'; // Import heart icon

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
      {/* Navigation Bar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>Restaurant Finder</Navbar.Brand>
          <Nav className="ml-auto">
            <Button variant="outline-light" onClick={() => navigate('/')} className="mr-2">
              Dashboard
            </Button>
            <Button variant="outline-light" onClick={logout}>
              Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>

      {/* Favorites List */}
      <Container className="mt-4">
        <h2>Your Favorites</h2>
        {favoritesList.length > 0 ? (
          <Row>
            {favoritesList.map((restaurant) => (
              <Col md={4} key={restaurant.restaurantid} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title className="d-flex justify-content-between align-items-center">
                      {restaurant.rname}
                      <Button
                        variant="link"
                        onClick={() => removeFavorite(restaurant.restaurantid)}
                      >
                        <HeartFill color="red" size={24} />
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
          <p>You have no favorite restaurants.</p>
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

export default Favorites;
