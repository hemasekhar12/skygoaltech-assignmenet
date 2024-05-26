const express = require('express');
const db = require('./db');

const router = express.Router();

router.get('/details', (req, res) => {
  const userId = req.user.id;

  db.get('SELECT id, username FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  });
});

module.exports = router;
