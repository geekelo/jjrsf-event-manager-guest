import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import GuestEventsPage from "./pages/guestPage"
import GuestNavbar from "./components/header/nav"
import GuestEventAccess from "./pages/eventAccess"


function App() {
  return (
    <Router>
      <GuestNavbar />
      <Routes>
        <Route path="/" element={<GuestEventsPage />} />
        <Route path="/event/:unique_id" element={<GuestEventAccess />} />
      </Routes>
    </Router>
  )
}

export default App
