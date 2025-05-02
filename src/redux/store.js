import { configureStore } from "@reduxjs/toolkit"
import eventsReducer from "./slices/eventSlice"
import frontdeskReducer from "./slices/frontdeskSlice"
import attendeeReducer from "./slices/attendeeSlice"
import feedbackReducer from "./slices/feedbackSlice"
import streamReducer from "./slices/streamSlice"

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    frontdesk: frontdeskReducer,
    attendee: attendeeReducer,
    feedback: feedbackReducer,
    streams: streamReducer,
  },
})
