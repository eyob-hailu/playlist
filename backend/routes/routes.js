const express = require("express");
const {
  getAllSongs,
  getSong,
  getStats,
  createSong,
  deleteSong,
  updateSong,
} = require("../controllers/controller");

const router = express.Router();

// GET all songs
router.get("/", getAllSongs);

// GET a single song
router.get("/:id", getSong);

// POST a new song
router.post("/", createSong);

// DELETE a song
router.delete("/:id", deleteSong);

// UPDATE a song
router.patch("/:id", updateSong);

//GET song stats
router.get('/stats', getStats);

module.exports = router;
