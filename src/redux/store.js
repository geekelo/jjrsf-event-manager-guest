import { configureStore } from '@reduxjs/toolkit';
import guestReducer from './slices/guestSlice';

export const store = configureStore({
  reducer: {
    guest: guestReducer,
  },
});
