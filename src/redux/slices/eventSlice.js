import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config';

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async () => {
    try {
      const res = await axiosInstance.get('/api/v1/events');
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch feedbacks"
      );
    }
    
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    filteredEvents: [], 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredEvents = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default eventsSlice.reducer;
