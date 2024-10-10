 // Define a Mongoose schema for User
 const mongoose = require('mongoose');
 const fileDataSchema = new mongoose.Schema({
    userName: String,
    userEmail: String,
    allowedViewCount: Number,
    stlFile: String,
    urlHitCount: { type: Number, default: 0 },
    status: String,
    publicUrls: String,
    fileId: String,
    token : String,
    timestamps: { type: Date, default: Date.now }
  });

  module.exports = mongoose.model('fileData', fileDataSchema);