const express = require("express");
const router = express.Router();
const {
  getAllSongs,
  getSong,
  getStats,
  createSong,
  deleteSong,
  updateSong,
} = require("../controllers/controller");

router.get('/stats', getStats);

module.exports = router;