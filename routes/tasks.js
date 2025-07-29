const express = require('express');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');
const router = express.Router();

const auth = (req,res,next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if(!token) return res.status(401).json({ message: 'No token' });
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = userId;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/', auth, async (req,res) => {
  const tasks = await Task.find({ user: req.userId });
  res.json(tasks);
});

router.post('/', auth, async (req,res) => {
  const task = new Task({ ...req.body, user: req.userId });
  await task.save();
  res.json(task);
});

router.get('/:id', auth, async (req,res) => {
  const task = await Task.findOne({ _id:req.params.id, user:req.userId });
  res.json(task);
});

router.put('/:id', auth, async (req,res) => {
  const task = await Task.findOneAndUpdate(
    { _id:req.params.id, user:req.userId },
    req.body,
    { new: true }
  );
  res.json(task);
});

router.delete('/:id', auth, async (req,res) => {
  await Task.findOneAndDelete({ _id:req.params.id, user:req.userId });
  res.json({ message: 'Deleted' });
});

module.exports = router;
