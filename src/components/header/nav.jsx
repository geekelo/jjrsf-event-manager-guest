import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import "../../styles/nav.css"

const GuestNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="guest-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">JJRSF</Link>

        <div className={`navbar-links ${isOpen ? "active" : ""}`}>
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/faqs" onClick={() => setIsOpen(false)}>FAQs</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
        </div>

        <button className="navbar-toggle" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  )
}

export default GuestNavbar
