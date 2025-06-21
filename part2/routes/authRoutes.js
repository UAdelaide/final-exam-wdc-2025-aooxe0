const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('DEBUG received:', username, password);

  try {
    const [rows] = await db.query(
      'SELECT * FROM Users WHERE username = ? AND password_hash = ?',
      [username, password]
    );
    console.log('DEBUG db result:', rows);

    if (rows.length === 0) {
      return res.status(401).send('Invalid credentials');
    }

    const user = rows[0];
    req.session.user = user;


    if (user.role === 'owner') {
      return res.redirect('/owner-dashboard.html');
    } else if (user.role === 'walker') {
      return res.redirect('/walker-dashboard.html');
    } else {
      return res.status(403).send('Unknown role');
    }

  } catch (err) {
    console.error(err);
    res.status(500).send('Login error');
  }
});


router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout failed:', err);
      return res.status(500).send('Logout error');
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});


module.exports = router;
