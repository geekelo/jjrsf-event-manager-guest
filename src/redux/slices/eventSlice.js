import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../config"

export const fetchEvents = createAsyncThunk("events/fetchEvents", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("/api/v1/events")
    return res.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch events")
  }
})

export const fetchSingleEvent = createAsyncThunk("events/fetchSingleEvent", async (unique_id, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/api/v1/foundation_events/${unique_id}?unique_id=${unique_id} `)
    return res.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch event")
  }
})

// New action for event registration
export const registerForEvent = createAsyncThunk(
  "events/registerForEvent",
  async ({ eventId, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/api/v1/foundation_events/quick_registrations`, {event_id: (eventId), event_attendee:formData})
      return res.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to register for event")
    }
  },
)

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    singleEvent: null,
    filteredEvents: [],
    loading: false,
    error: null,
    registrationLoading: false,
    registrationError: null,
    registrationSuccess: false,
  },
  reducers: {
    setFilteredEvents: (state, action) => {
      state.filteredEvents = action.payload
    },
    resetRegistration: (state) => {
      state.registrationLoading = false
      state.registrationError = null
      state.registrationSuccess = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false
        state.filteredEvents = action.payload
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })

      .addCase(fetchSingleEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSingleEvent.fulfilled, (state, action) => {
        state.loading = false
        state.singleEvent = action.payload
      })
      .addCase(fetchSingleEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })

      // Handle registration actions
      .addCase(registerForEvent.pending, (state) => {
        state.registrationLoading = true
        state.registrationError = null
        state.registrationSuccess = false
      })
      .addCase(registerForEvent.fulfilled, (state) => {
        state.registrationLoading = false
        state.registrationSuccess = true
      })
      .addCase(registerForEvent.rejected, (state, action) => {
        state.registrationLoading = false
        state.registrationError = action.payload || action.error.message
      })
  },
})

export const { setFilteredEvents, resetRegistration } = eventsSlice.actions
export default eventsSlice.reducer
