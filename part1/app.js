const express = require('express');
const app = express();
const port = 8080;
const db = require('./db');

const dogsRoute = require('./routes/dogs');
const walkRequestsRoute = require('./routes/walkrequests');
const walkersRoute = require('./routes/walkers');

app.use('/api/dogs', dogsRoute);
app.use('/api/walkrequests/open', walkRequestsRoute);
app.use('/api/walkers/summary', walkersRoute);


async function insertTestData() {
  try {
    await db.query(`
      INSERT IGNORE INTO Users (username, email, password_hash, role) VALUES
        ('alice123', 'alice@example.com', 'hashed123', 'owner'),
        ('carol123', 'carol@example.com', 'hashed789', 'owner'),
        ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
        ('newwalker', 'new@example.com', 'hashed000', 'walker')
    `);

    await db.query(`
      INSERT IGNORE INTO Dogs (owner_id, name, size) VALUES
        ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
        ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small')
    `);

    await db.query(`
      INSERT IGNORE INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
      VALUES
        ((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
        ((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted')
    `);

    await db.query(`
      INSERT IGNORE INTO WalkRatings (request_id, walker_id, owner_id, rating, comments)
      VALUES
        (2, (SELECT user_id FROM Users WHERE username = 'bobwalker'), (SELECT user_id FROM Users WHERE username = 'carol123'), 5, 'Great walk!'),
        (1, (SELECT user_id FROM Users WHERE username = 'bobwalker'), (SELECT user_id FROM Users WHERE username = 'alice123'), 4, 'Good walker.')
    `);

    console.log('Test data inserted');
  } catch (err) {
    console.error('Failed to insert test data:', err.message);
  }
}

insertTestData();

app.listen(port, '0.0.0.0', () => {
  console.log('Server is running');
});
