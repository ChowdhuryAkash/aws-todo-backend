const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed });
  await user.save();
  res.json({ message: 'User created' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.status(400).json({ message: 'No user' });
  const ok = await bcrypt.compare(password, user.password);
  if(!ok) return res.status(400).json({ message: 'Wrong credentials' });
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ token, name: user.name });
});

module.exports = router;
