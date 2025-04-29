import { Link } from "react-router-dom"
import { Mail, Phone, MapIcon, Globe } from "lucide-react"

const FooterSection = () => {
  return (
    <footer className="premium-footer" id="contact">
      <div className="footer-top-pattern"></div>
      <div className="premium-container">
        <div className="premium-footer-content">
          <div className="premium-footer-logo">
            <img src="/jjrsf-logo.png" alt="JJRSF Logo" className="footer-logo" />
            <h3>JJRS Foundation</h3>
            <p>We aim at lifting believers out of the pit of religion and self effort in order for all to be saved and come to the knowledge of the truth.</p>
            <div className="premium-social-icons">
              <a
                href="LinkedIn: https://www.linkedin.com/company/jjrsf"
                className="premium-social-icon"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a
                href="https://www.youtube.com/channel/UCqfgW9RczVq5md7Gj01qG0g"
                className="premium-social-icon"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
              <a
                href="website: https://jjrsf.org/"
                className="premium-social-icon"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Website"
              >
                <Globe size={16} />
              </a>
              <a
                href="mailto:jjrsfoundation@gmail.com"
                className="premium-social-icon"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          <div className="premium-footer-links">
            <div className="footer-column">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <a href="#home">Home</a>
                </li>
                <li>
                  <a href="#events">Events</a>
                </li>
                <li>
                  <a href="#faqs">FAQs</a>
                </li>
                <li>
                  <Link to="/admin/login">Admin Login</Link>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Contact</h4>
              <ul className="contact-list">
                <li>
                  <Mail size={16} />
                  <span>info@jjrsfoundation.org</span>
                </li>
                <li>
                  <Mail size={16} />
                  <span>jjrsfoundation@gmail.com</span>
                </li>
                <li>
                  <Phone size={16} />
                  <span>(+234) 809 914 5730
                  </span>
                  
                </li>
                <li><Phone size={16} />
                  <span>(+234)  809 676 7151
                  </span></li>
               
              </ul>
            </div>
          </div>
        </div>

        <div className="premium-footer-bottom">
          <p>&copy; {new Date().getFullYear()} JJRSF Foundation. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default FooterSection
