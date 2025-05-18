const mongoose = require('mongoose');

const AlbumCommentSchema = new mongoose.Schema({
  artist: String,
  album: String,
  comment: String,
  rating: Number,  // NEW
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AlbumComment', AlbumCommentSchema);
