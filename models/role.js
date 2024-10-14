 // Define a Mongoose schema for User
 const mongoose = require('mongoose');
 const userSchema = new mongoose.Schema({
    name: String,
    access: Array,
    timestamps: { type: Date, default: Date.now }
  });

  module.exports = mongoose.model('role', userSchema);