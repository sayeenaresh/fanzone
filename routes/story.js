const express = require('express');
const router = express.Router();
const FanStory = require('../models/FanStory');

router.get('/submit-story', (req, res) => {
  res.render('submit-story');
});

router.post('/submit-story', async (req, res) => {
  const { artist, story } = req.body;
  try {
    await FanStory.create({ artist, story });
    res.render('success');
  } catch (err) {
    console.error("Error saving fan story:", err);
    res.render('error', { message: 'Failed to submit your story.' });
  }
});

router.get('/stories', async (req, res) => {
  const artistFilter = req.query.artist || '';
  try {
    const stories = artistFilter
      ? await FanStory.find({ artist: new RegExp(artistFilter, 'i') }).sort({ submittedAt: -1 })
      : await FanStory.find().sort({ submittedAt: -1 });

    res.render('stories', { stories, artistFilter });
  } catch (err) {
    console.error("Error fetching stories:", err);
    res.render('error', { message: 'Could not load stories.' });
  }
});

module.exports = router;
