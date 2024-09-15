const Song = require('../model/model')
const mongoose = require('mongoose')

// get all songs
const getAllSongs = async (req, res) => {
  const getsongs = await Song.find({}).sort({createdAt: -1})

  res.status(200).json(getsongs)
}

// get a single song
// create a new song
const createSong = async (req, res) => {
  const {title, artist, album,genre} = req.body

  let emptyFields = []

  if (!title) {
    emptyFields.push('title')
  }
  if (!artist) {
    emptyFields.push('artist')
  }
  if (!album) {
    emptyFields.push('album')
  }
  if (!genre) {
    emptyFields.push('genre')
  }
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all fields', emptyFields })
  }

  // add to the mongo db
  try {
    const addsong = await Song.create({ title, artist, album, genre })
    res.status(200).json(addsong)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
// delete a song
const deleteSong = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such song'})
  }
  const deletesong = await Song.findOneAndDelete({_id: id})
  if(!deletesong) {
    return res.status(400).json({error: 'No such song'})
  }
  res.status(200).json(deletesong)
}

// update a song
const updateSong = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such song'})
  }

  const updatesong = await Song.findOneAndUpdate({_id: id}, {
    ...req.body
  })

  if (!updatesong) {
    return res.status(400).json({error: 'No such song'})
  }

  res.status(200).json(updatesong)
}

// Async function to get statistics about songs
const getStats = async (req, res) => {
  try {
    // Count total number of songs in the collection
    const totalSongs = await Song.countDocuments();

    // Get unique artists, albums, and genres
    const artists = await Song.distinct('artist');
    const totalArtists = artists.length;
    
    const albums = await Song.distinct('album');
    const totalAlbums = albums.length;
    
    const genres = await Song.distinct('genre');
    const totalGenres = genres.length;

    // Aggregate the number of songs per genre
    const songsPerGenre = await Song.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } } // Group by genre and count the number of songs in each genre
    ]);

    // Aggregate the number of songs per artist
    const songsPerArtist = await Song.aggregate([
      { $group: { _id: '$artist', count: { $sum: 1 } } } // Group by artist and count the number of songs for each artist
    ]);

    // Aggregate the number of albums per artist
    const albumsPerArtist = await Song.aggregate([
      { $group: { _id: '$artist', albums: { $addToSet: '$album' } } }, // Group by artist and create a set of unique albums
      { $project: { artist: '$_id', _id: 0, albumCount: { $size: '$albums' } } } // Project the artist name and count the number of albums
    ]);

    // Aggregate the number of songs per album
    const songsPerAlbum = await Song.aggregate([
      { $group: { _id: '$album', count: { $sum: 1 } } } // Group by album and count the number of songs in each album
    ]);

    // Send the statistics as a JSON response
    res.status(200).json({
      totalSongs,      // Total number of songs
      totalArtists,    // Total number of unique artists
      totalAlbums,     // Total number of unique albums
      totalGenres,     // Total number of unique genres
      songsPerGenre,   // Number of songs per genre
      songsPerArtist,  // Number of songs per artist
      albumsPerArtist, // Number of albums per artist
      songsPerAlbum    // Number of songs per album
    });
  } catch (error) {
    // Send an error response if any exception occurs
    res.status(500).json({ message: error.message });
  }
};

  

module.exports = {
  getAllSongs,
  getSong,
  createSong,
  deleteSong,
  updateSong,
  getStats
}

