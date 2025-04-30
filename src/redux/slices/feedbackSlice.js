import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../config"

// Async thunk for creating feedback
export const createFeedback = createAsyncThunk(
  "feedback/createFeedback",
  async ({ name, review, testimony, eventId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/v1/event_feedbacks", {
        event_id: eventId,
        event_feedback: {
          name: name,
          review: review,
          testimony: testimony,
        },
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to submit feedback")
    }
  },
)

// Async thunk for fetching feedbacks
export const fetchFeedbacks = createAsyncThunk("feedback/fetchFeedbacks", async (eventId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/api/v1/event_feedbacks?event_id=${eventId}`)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch feedbacks")
  }
})

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    feedbacks: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetFeedbackStatus: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Create feedback cases
      .addCase(createFeedback.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.feedbacks.push(action.payload)
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
      // Fetch feedbacks cases
      .addCase(fetchFeedbacks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.loading = false
        state.feedbacks = action.payload
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
  },
})

export const { resetFeedbackStatus } = feedbackSlice.actions
export default feedbackSlice.reducer
