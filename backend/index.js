// index.js

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL pool setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '123456',
  port: 5432,
});

// Test database connection
pool.connect((err) => {
  if (err) {
    console.error('Connection error', err.stack);
  } else {
    console.log('Connected to the database');
  }
});

// API Endpoints

// User Login
// index.js

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt:', username); // Log the username attempting to log in
  
    try {
      const query = 'SELECT * FROM Users WHERE USERNAME = $1 AND PASSWORD = $2';
      const values = [username, password];
  
      const result = await pool.query(query, values);
      console.log('Query result:', result.rows); // Log the query result
  
      if (result.rows.length > 0) {
        res.json({ success: true, userId: result.rows[0].userid });
      } else {
        res.json({ success: false, message: 'Invalid credentials' });
      }
    } catch (err) {
      console.error('Error during login:', err); // Log detailed error
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  });
  

// Get Restaurants Based on Filters

app.get('/api/restaurants', async (req, res) => {
  const { searchQuery, priceRange } = req.query;

  // Build your query based on filters
  let query = `
    SELECT DISTINCT R.*
    FROM Restaurants R
    LEFT JOIN MenuItem M ON R.RESTAURANTID = M.RESTAURANTID
    WHERE 1=1
  `;
  let values = [];
  let count = 1;

  if (searchQuery) {
    // We'll search in multiple columns: RNAME, CUISINENAME from Restaurants, and ITEMNAME, ITEMCATEGORY1, ITEMCATEGORY2 from MenuItem
    query += ` AND (
      R.RNAME ILIKE $${count}
      OR R.CUISINENAME ILIKE $${count}
      OR M.ITEMNAME ILIKE $${count}
      OR M.ITEMCATEGORY1 ILIKE $${count}
      OR M.ITEMCATEGORY2 ILIKE $${count}
    )`;
    values.push(`%${searchQuery}%`);
    count++;
  }

  if (priceRange) {
    query += ` AND R.PRICERANGE = $${count++}`;
    values.push(priceRange);
  }

  // ORDER BY clause to sort by RESTAURANTID
  query += ' ORDER BY R.RESTAURANTID';

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching restaurants:', err);
    res.status(500).send('Server error');
  }
});

// Add a restaurant to favorites
app.post('/api/favorites', async (req, res) => {
  const { userId, restaurantId } = req.body;

  try {
    const query = 'INSERT INTO Favorites (USERID, RESTAURANTID) VALUES ($1, $2)';
    const values = [userId, restaurantId];

    await pool.query(query, values);

    res.json({ success: true, message: 'Restaurant added to favorites' });
  } catch (err) {
    if (err.code === '23505') {
      // Duplicate key error, the favorite already exists
      res.status(400).json({ success: false, message: 'Restaurant already in favorites' });
    } else {
      console.error('Error adding to favorites:', err);
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  }
});

// Remove a restaurant from favorites
app.delete('/api/favorites', async (req, res) => {
  const { userId, restaurantId } = req.body;

  try {
    const query = 'DELETE FROM Favorites WHERE USERID = $1 AND RESTAURANTID = $2';
    const values = [userId, restaurantId];

    const result = await pool.query(query, values);

    if (result.rowCount > 0) {
      res.json({ success: true, message: 'Restaurant removed from favorites' });
    } else {
      res.status(400).json({ success: false, message: 'Favorite not found' });
    }
  } catch (err) {
    console.error('Error removing from favorites:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// Get a user's favorite restaurants
app.get('/api/favorites', async (req, res) => {
  const { userId } = req.query;

  try {
    const query = `
      SELECT R.*
      FROM Favorites F
      JOIN Restaurants R ON F.RESTAURANTID = R.RESTAURANTID
      WHERE F.USERID = $1
    `;
    const values = [userId];

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// Start the Server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
