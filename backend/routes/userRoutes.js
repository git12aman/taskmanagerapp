const express = require('express');
const User = require('../models/User');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const router = express.Router();

// Only admin users
router.get('/', auth, admin, async (req, res) => {
  // User listing with pagination, filtering can be added as needed
  const users = await User.find().select('-password');
  res.json(users);
});

router.delete('/:id', auth, admin, async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.json({ message: "User deleted" });
});

router.patch('/:id', auth, admin, async (req, res) => {
  const { id } = req.params;
  const { email, role } = req.body;
  const user = await User.findByIdAndUpdate(id, { email, role }, { new: true });
  res.json(user);
});

module.exports = router;
