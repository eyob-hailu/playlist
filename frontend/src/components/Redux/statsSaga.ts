import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { fetchStats } from "./statsSlice";

// Worker saga to fetch stats
function* fetchStatsSaga() {
  try {
    const response = yield call(axios.get, "http://localhost:5000/api/stats"); // Adjust the URL as needed
    yield put(fetchStats.fulfilled(response.data));
  } catch (error) {
    yield put(fetchStats.rejected(error));
  }
}

// Watcher saga to watch for fetchStats action
export function* watchFetchStats() {
  yield takeEvery(fetchStats.pending.toString(), fetchStatsSaga);
}
