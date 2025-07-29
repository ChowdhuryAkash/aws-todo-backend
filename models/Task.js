// Task.js
const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  date: Date,
  importance: { type: String, enum: ['high','mid','low'] },
  completed: { type: Boolean, default: false },
});
module.exports = mongoose.model('Task', taskSchema);