const express = require('express');
const router = express.Router();
const User = require('../model/users');

router.get('/api/users', async (req, res) => {
    try {
      // Find all users in the 'users' collection
      const allUsers = await User.find();

      // Send the list of users as JSON response
      res.json(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
router.get('/api/role', async (req, res) => {
        try {
          // Find all users in the 'users' collection
          const allUsers = await Role.find();
    
          // Send the list of users as JSON response
          res.json(allUsers);
        } catch (error) {
          console.error('Error fetching users:', error);
          res.status(500).json({ error: 'Failed to fetch users' });
        }
      });
  });


module.exports = router;