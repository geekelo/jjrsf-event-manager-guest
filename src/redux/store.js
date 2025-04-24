import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './slices/eventSlice';

export const store = configureStore({
  reducer: {
    events: eventsReducer,
  },
});
