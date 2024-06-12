const bcrypt = require('bcrypt');
const db = require('../database/db');

const signup = async (req, res) => {
  const { firstName, lastName, username, password, email, phone, role } = req.body;

  // Set default role as "parent" if not provided
  const userRole = role || 'parent';

  try {
    // Check if the username already exists
    const usernameCheckQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(usernameCheckQuery, [username], async (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (result.length > 0) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save user credentials to the database
      const insertUserQuery = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
      db.query(insertUserQuery, [username, hashedPassword, userRole], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err });
        }

        // Get the inserted user's ID
        const userID = result.insertId;

        // Insert into the parent table with the userID and other details
        const insertParentQuery = 'INSERT INTO parent (userID, firstName, lastName, email, phone) VALUES (?, ?, ?, ?, ?)';
        db.query(insertParentQuery, [userID, firstName, lastName, email, phone], (err) => {
          if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
          }
          res.status(201).json({ message: 'User Signed Up successfully' });
        });
      });
    });
  } catch (error) {
    console.error('Error signing up user:', error);
    res.status(500).json({ message: 'Signing up failed', error: error.message });
  }
};

module.exports = { signup };
