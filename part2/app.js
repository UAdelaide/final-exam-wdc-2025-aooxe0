const express = require('express');
const path = require('path');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(session({
  secret: 'dogwalk-secret',
  resave: false,
  saveUninitialized: false
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/auth', authRoutes);


app.get('/owner-dashboard', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'owner') {
    return res.redirect('/');
  }
    res.sendFile(path.join(__dirname, 'public', 'owner-dashboard.html'));
});

app.get('/walker-dashboard', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'walker') {
    return res.redirect('/');
  }
  res.send(`Welcome Walker: ${req.session.user.username}`);
});

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);


module.exports = app;