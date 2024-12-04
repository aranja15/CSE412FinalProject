// src/components/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Login({ setUserId, setUsername }) {
  // State for login form
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // State for sign-up form (dummy)
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        username: usernameInput,
        password,
      });

      if (response.data.success) {
        setUserId(response.data.userId);
        setUsername(response.data.username);
        navigate('/');
      } else {
        setError(response.data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Axios error:', err);
      setError('Server error: ' + err.message);
    }
  };

  // Dummy handler for sign-up form
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // Do nothing
  };

  return (
    <Container className="mt-5">
      <Row>
        {/* Login Form */}
        <Col md={6}>
          <h2 className="text-center mb-4">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group controlId="loginUsername">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
                placeholder="Enter your username"
              />
            </Form.Group>
            <Form.Group controlId="loginPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </Form.Group>
            <Button variant="primary" type="submit" block>
              Login
            </Button>
          </Form>
        </Col>

        {/* Dummy Sign-Up Form */}
        <Col md={6}>
          <h2 className="text-center mb-4">Sign Up</h2>
          <Form onSubmit={handleSignupSubmit}>
            <Form.Group controlId="signupUsername">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                required
                placeholder="Choose a username"
              />
            </Form.Group>
            <Form.Group controlId="signupEmail">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </Form.Group>
            <Form.Group controlId="signupPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
                placeholder="Choose a password"
              />
            </Form.Group>
            <Button variant="secondary" type="submit" block>
              Sign Up
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
