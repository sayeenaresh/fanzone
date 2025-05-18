const express = require('express');
const axios = require('axios');
const router = express.Router();
const FanStory = require('../models/FanStory');
const AlbumComment = require('../models/AlbumComment');

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/artist', async (req, res) => {
  const artistName = req.query.name;
  const apiKey = process.env.LASTFM_API_KEY;

  try {
    const infoRes = await axios.get('https://ws.audioscrobbler.com/2.0/', {
      params: {
        method: 'artist.getinfo',
        artist: artistName,
        api_key: apiKey,
        format: 'json'
      }
    });

    const artist = infoRes.data.artist;

    const albumRes = await axios.get('https://ws.audioscrobbler.com/2.0/', {
      params: {
        method: 'artist.gettopalbums',
        artist: artistName,
        api_key: apiKey,
        format: 'json',
        limit: 5
      }
    });
    const topAlbums = albumRes.data.topalbums.album;

    const trackRes = await axios.get('https://ws.audioscrobbler.com/2.0/', {
      params: {
        method: 'artist.gettoptracks',
        artist: artistName,
        api_key: apiKey,
        format: 'json',
        limit: 5
      }
    });
    const topTracks = trackRes.data.toptracks.track;

    const fanStories = await FanStory.find({ artist: new RegExp(artistName, 'i') }).sort({ submittedAt: -1 });

    const albumComments = await AlbumComment.find({ artist: new RegExp(artistName, 'i') });

    res.render('artist', {
      artist,
      topAlbums,
      topTracks,
      fanStories,
      albumComments
    });
  } catch (err) {
    console.error("Error fetching artist info:", err.message);
    res.render('error', { message: 'Failed to load artist info. Please try again.' });
  }
});

router.post('/album-comment', async (req, res) => {
  const { artist, album, comment, rating } = req.body;
  try {
    await AlbumComment.create({ artist, album, comment, rating });
    res.redirect(`/artist?name=${encodeURIComponent(artist)}`);
  } catch (err) {
    console.error('Error saving comment:', err);
    res.render('error', { message: 'Failed to save comment.' });
  }
});

module.exports = router;