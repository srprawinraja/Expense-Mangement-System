const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },

  isGuest: {
    type: Boolean,
    default: true
  },

  email: {
    type: String,
    lowercase: true,
    trim: true
  },

  password: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('User', userSchema);
