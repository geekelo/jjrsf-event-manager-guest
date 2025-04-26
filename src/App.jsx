import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import GuestEventsPage from "./pages/guestPage"
import GuestNavbar from "./components/header/nav"
import GuestEventAccess from "./pages/eventAccess"
import FrontDeskLogin from './pages/frontend'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Admit from "./pages/admit"

function App() {
  return (
    <>
      <ToastContainer />
    <Router>
      <GuestNavbar />
      <Routes>
        <Route path="/" element={<GuestEventsPage />} />
       
        <Route path="/event/:unique_id" element={<GuestEventAccess />} />
        <Route path="/event/frontdesk/:unique_id" element={ <FrontDeskLogin />} />
        <Route path="/event/frontdesk/:unique_id/admit" element={ <Admit />} />

      </Routes>
    
      
    </Router>
    </>
  )
}

export default App
