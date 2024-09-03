import { all, takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import {
  fetchSongsStart,
  fetchSongsSuccess,
  fetchSongsFailure,
  addSong,
  updateSong,
  deleteSong,
} from './songSlice';
import { fetchStats } from './statsSlice';

// Existing API configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

type SagaReturnType = Generator<unknown, void, unknown>;

function* fetchSongs(): SagaReturnType {
  try {
    const response = yield call(api.get, '/songs');
    yield put(fetchSongsSuccess(response.data as Song[]));
  } catch (error) {
    yield put(fetchSongsFailure((error as Error).message));
  }
}

function* fetchStatsSaga() {
  try {
    const response = yield call(api.get, 'http://localhost:5000/api/stats');
    yield put(fetchStats.fulfilled(response.data));
  } catch (error) {
    yield put(fetchStats.rejected(error));
  }
}

function* addSongSaga(action: { payload: Omit<Song, 'id'> }): SagaReturnType {
  try {
    const response = yield call(api.post, '/songs', action.payload);
    yield put(fetchSongsStart()); // Fetch updated list of songs
    yield put(fetchStats.pending()); // Trigger stats refresh
  } catch (error) {
    yield put(fetchSongsFailure((error as Error).message));
  }
}

function* updateSongSaga(action) {
  try {
    const { _id, ...data } = action.payload;
    if (!_id) throw new Error('Song ID is missing');
    
    const response = yield call(api.patch, `/songs/${_id}`, data);
    console.log('API response for update:', response.data); // Check API response
    yield put(updateSong(response.data));
    yield put(fetchStats()); // Refresh stats
  } catch (error) {
    console.error('Update Song Error:', error.message);
  }
}




function* deleteSongSaga(action: { payload: string }): SagaReturnType {
  try {
    yield call(api.delete, `/songs/${action.payload}`);
    yield put(fetchSongsStart()); // Fetch updated list of songs
    yield put(fetchStats.pending()); // Trigger stats refresh
  } catch (error) {
    yield put(fetchSongsFailure((error as Error).message));
  }
}

function* rootSaga() {
  yield all([
    takeLatest(fetchSongsStart.type, fetchSongs),
    takeLatest(addSong.type, addSongSaga),
    takeLatest(updateSong.type, updateSongSaga),
    takeLatest(deleteSong.type, deleteSongSaga),
    takeLatest(fetchStats.pending.toString(), fetchStatsSaga), // Use takeLatest for fetchStats
  ]);
}

export default rootSaga;
