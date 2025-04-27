import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../config"

export const markAttendee = createAsyncThunk(
  "attendee/markAttendee",
  async ({ event_id, mode, email, otp }, { rejectWithValue }) => {
    try {
      const payload = {
        event_id,
        mode
      }
      
      // Add optional parameters if provided
      if (email) payload.email = email
      if (otp) payload.otp = otp
      
      const res = await axiosInstance.patch("/api/v1/mark_attendee", payload)
      return res.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to mark attendance")
    }
  }
)

const attendeeSlice = createSlice({
  name: "attendee",
  initialState: {
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    resetAttendanceStatus: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(markAttendee.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(markAttendee.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(markAttendee.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
  }
})

export const { resetAttendanceStatus } = attendeeSlice.actions
export default attendeeSlice.reducer