import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './slices/eventSlice';
import frontdeskReducer from './slices/frontdeskSlice'

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    frontdesk: frontdeskReducer,
  },
});
