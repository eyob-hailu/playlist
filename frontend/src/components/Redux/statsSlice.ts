import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the initial state type
interface StatsState {
  data: SongStatsData | null;
  loading: boolean;
  error: string | null;
}

// Define the type for the API response
interface SongStatsData {
  totalSongs?: number;
  totalArtists?: number;
  totalAlbums?: number;
  totalGenres?: number;
  songsPerGenre: { _id: string; count: number }[];
  songsPerArtist: { _id: string; count: number }[];
  albumsPerArtist: { _id: string; albumCount: number; artist: String }[];
  songsPerAlbum: { _id: string; count: number }[];
}

// Initial state
const initialState: StatsState = {
  data: null,
  loading: false,
  error: null,
};

// Create async thunk for fetching stats
export const fetchStats = createAsyncThunk(
  'stats/fetchStats',
  async () => {
    const response = await axios.get<SongStatsData>('http://localhost:5000/api/stats');
    return response.data;
  }
);

// Create the slice
const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action: PayloadAction<SongStatsData>) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch stats';
        state.loading = false;
      });
  },
});

export default statsSlice.reducer;
