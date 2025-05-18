const mongoose = require('mongoose');
const FanStorySchema = new mongoose.Schema({
  artist: String,
  story: String,
  submittedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('fanstory', FanStorySchema);