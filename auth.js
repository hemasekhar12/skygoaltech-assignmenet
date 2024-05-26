const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const router = express.Router();
const SECRET_KEY = 'your_jwt_secret_key';

router.post('/signup', (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: err.message });

    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    stmt.run(username, hash, (err) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({ message: 'User created' });
    });
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token });
    });
  });
});

module.exports = router;
