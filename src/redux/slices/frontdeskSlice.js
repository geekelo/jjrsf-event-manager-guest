import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config';

// Async thunk for front desk authentication
export const authenticateFrontDesk = createAsyncThunk(
  'frontdeskAuth/authenticate',
  async ({ unique_id, passcode }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/access_front_desk/?unique_id=${unique_id}&passcode=${passcode}`
      );
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Authentication failed'
      );
    }
  }
);
const frontdeskSlice = createSlice({
  name: 'frontdeskAuth',
  initialState: {
    loading: false,
    error: null,
    frontDeskData: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(authenticateFrontDesk.pending, (state) => {
        state.loading = true;  
        state.error = null;
      })
      .addCase(authenticateFrontDesk.fulfilled, (state, action) => {
        state.loading = false;  
        state.frontDeskData = action.payload.front_desk;
      })
      .addCase(authenticateFrontDesk.rejected, (state, action) => {
      
        state.loading = false; 
        state.error = action.payload || action.error.message;
      });
  },
  
});


export default frontdeskSlice.reducer;
