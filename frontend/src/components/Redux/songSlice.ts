import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Song {
  _id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
}

// Define the initial state type
interface SongsState {
  songs: Song[];
  loading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: SongsState = {
  songs: [],
  loading: false,
  error: null,
};

// Create the slice
const songSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    fetchSongsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSongsSuccess: (state, action: PayloadAction<Song[]>) => {
      state.songs = action.payload;
      state.loading = false;
    },
    fetchSongsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addSong: (state, action: PayloadAction<Omit<Song, "_id">>) => {
      // You no longer need to generate IDs here
      state.songs.push(action.payload as Song); // Assuming the server will provide the ID
    },
    updateSong: (state, action: PayloadAction<Song>) => {
      console.log('Update Song Reducer Action:', action.payload); // Verify payload
      const index = state.songs.findIndex(song => song._id === action.payload._id);
      if (index !== -1) {
        state.songs[index] = action.payload;
      }
    },
    deleteSong: (state, action: PayloadAction<string>) => {
      state.songs = state.songs.filter(song => song._id !== action.payload);
    },
  },
});

// Export actions
export const {
  fetchSongsStart,
  fetchSongsSuccess,
  fetchSongsFailure,
  addSong,
  updateSong,
  deleteSong,
} = songSlice.actions;

// Export the reducer
export default songSlice.reducer;

// Selector to get the list of songs from the state
export const selectSongs = (state: { songs: SongsState }) => state.songs.songs;
