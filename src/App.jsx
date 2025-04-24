import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import GuestEventsPage from "./pages/guestPage"
import GuestNavbar from "./components/header/nav"
import EventDetails from "./components/guest/eventDetails"


function App() {
  return (
    <Router>
      <GuestNavbar />
      <Routes>
        <Route path="/" element={<GuestEventsPage />} />
        <Route path="/event/:unique_id" element={<EventDetails />} />
      </Routes>
    </Router>
  )
}

export default App
