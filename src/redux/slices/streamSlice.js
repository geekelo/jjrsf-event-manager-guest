import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../config"

export const fetchStreamingPlatforms = createAsyncThunk(
  "streams/fetchStreamingPlatforms",
  async (eventId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/v1/event_streaming_platforms?event_id=${eventId}`)
      return res.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch streaming platforms")
    }
  }
)

const streamSlice = createSlice({
  name: "streams",
  initialState: {
    platforms: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearStreams: (state) => {
      state.platforms = []
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStreamingPlatforms.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStreamingPlatforms.fulfilled, (state, action) => {
        state.loading = false
        state.platforms = action.payload
      })
      .addCase(fetchStreamingPlatforms.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
  },
})

export const { clearStreams } = streamSlice.actions
export default streamSlice.reducer 