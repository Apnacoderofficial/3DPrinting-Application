 // Define a Mongoose schema for User
 const mongoose = require('mongoose');
 const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
    password: String,
    version: String,
    timestamps: { type: Date, default: Date.now }
  });

  module.exports = mongoose.model('users', userSchema);