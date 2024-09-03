import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import songReducer from './songSlice';
import statsReducer from './statsSlice'; // Import the stats reducer
import rootSaga from './sagas';

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();


const freezeActionsMiddleware = store => next => action => {
  if (process.env.NODE_ENV === 'development') {
    return next(Object.freeze(action)); // Freeze actions in development mode
  }
  return next(action);
};


// Configure the Redux store
const store = configureStore({
  reducer: {
    songs: songReducer,
    stats: statsReducer, // Add stats reducer to the store
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false, // Disable the serializable check
    }).concat(sagaMiddleware,freezeActionsMiddleware),
});

// Run the saga middleware
sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
