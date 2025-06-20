const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT * FROM Users WHERE username = ? AND password_hash = ?',
      [username, password]
    );

    if (rows.length === 1) {
      const user = rows[0];
      req.session.user = user;

      // Redirect based on role
      if (user.role === 'owner') {
        return res.redirect('/owner-dashboard');
      } else if (user.role === 'walker') {
        return res.redirect('/walker-dashboard');
      } else {
        return res.status(403).send('Unknown role');
      }
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Login error');
  }
});

module.exports = router;
