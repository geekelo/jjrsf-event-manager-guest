"use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../../styles/home.css"

const GuestNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 60) {
        // Reduced from 80 to 60 for quicker transition on mobile
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".premium-nav") && !event.target.closest(".premium-mobile-menu-button")) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <header className={`premium-header ${scrolled ? "scrolled" : ""}`}>
      <div className="premium-header-container">
        <div className="premium-logo-container">
          <img src="/jjrsf-logo.png" alt="JJRSF Logo" className="premium-logo" />
          <div className="premium-logo-text">
            <h1>JJRSF</h1>
            <span className="premium-logo-tagline">Program Portal</span>
          </div>
        </div>

        <button
          className={`premium-mobile-menu-button ${isOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`premium-nav ${isOpen ? "open" : ""}`}>
          <ul>
            <li className="active">
              <Link to="/" onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <a href="#events" onClick={() => setIsOpen(false)}>
                Events
              </a>
            </li>
            <li>
              <a href="#faqs" onClick={() => setIsOpen(false)}>
                FAQs
              </a>
            </li>
            <li>
              <a href="#contact" onClick={() => setIsOpen(false)}>
                Contact
              </a>
            </li>
           
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default GuestNavbar
