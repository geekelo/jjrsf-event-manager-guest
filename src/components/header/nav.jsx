"use client"
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import "../../styles/home.css"

const GuestNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 60) {
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

  const handleSectionClick = (e, sectionId) => {
    e.preventDefault()
    setIsOpen(false)

    if (location.pathname === "/") {
      const section = document.getElementById(sectionId)
      if (section) {
        section.scrollIntoView({ behavior: "smooth" })
      } else {
        window.location.hash = sectionId
      }
    } else {
      window.location.href = `/#${sectionId}`
    }
  }

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
              <a href="/#events" onClick={(e) => handleSectionClick(e, "events")}>Events</a>
            </li>
            <li>
              <a href="/#faqs" onClick={(e) => handleSectionClick(e, "faqs")}>FAQs</a>
            </li>
            <li>
              <a href="/#contact" onClick={(e) => handleSectionClick(e, "contact")}>Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default GuestNavbar
