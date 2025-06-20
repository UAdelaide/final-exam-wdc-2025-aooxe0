const express = require('express');
const path = require('path');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use('/auth', authRoutes);
app.use(session({
  secret: 'dogwalk-secret',
  resave: false,
  saveUninitialized: false
}));
app.get('/owner-dashboard', (req, res) => {
  if (req.session && req.session.user && req.session.user.role === 'owner') {
    res.send(`Welcome Owner: ${req.session.user.username}`);
  } else {
    res.status(403).send('Access denied');
  }
});

app.get('/walker-dashboard', (req, res) => {
  if (req.session && req.session.user && req.session.user.role === 'walker') {
    res.send(`Welcome Walker: ${req.session.user.username}`);
  } else {
    res.status(403).send('Access denied');
  }
});

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;