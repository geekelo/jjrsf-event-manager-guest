
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchEvents } from "../redux/slices/eventSlice"
import HeroSection from "../components/guest/HeroSection"
import EventsSection from "../components/guest/EventsSection"
import FAQsSection from "../components/guest/FAQsSection"
import FooterSection from "../components/guest/FooterSection"
import "../styles/home.css"
import { Mail } from "lucide-react"

const GuestEventsPage = () => {
  const dispatch = useDispatch()
  const { filteredEvents = [], loading } = useSelector((state) => state.events)

  useEffect(() => {
    dispatch(fetchEvents())
  }, [dispatch])

  return (
    <div className="premium-page">
      <HeroSection />
      <EventsSection events={filteredEvents} loading={loading} />
      <FAQsSection />
      <section className="premium-about-section" id="about">
        <div className="premium-container">
          <div className="premium-about-wrapper">
            <div className="premium-about-image">
              <div className="about-image-container">
                <div className="about-image-background"></div>
                <div className="about-image-pattern"></div>
                <div className="about-image-shape"></div>
              </div>
            </div>
            <div className="premium-about-content">
              <div className="premium-section-header left-aligned">
                <span className="section-kicker">Our Story</span>
                <h2>About JJRSF Foundation</h2>
              </div>
              <div className="section-decorator left-aligned">
                <span></span>
                <div className="decorator-icon">●</div>
                <span></span>
              </div>
              <div className="premium-about-text">
                <p>
                  JJRSF Foundation is dedicated to fostering transformative experiences that inspire growth and create
                  meaningful connections within our community.
                </p>
                <p>
                  Since our inception, we've been committed to developing leaders who are adaptive in bringing positive
                  change and influential in advancing our shared vision for a better future.
                </p>

                <div className="premium-values">
                  <div className="premium-value-item">
                    <div className="value-icon">
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M12,2L1,21H23M12,6L19.53,19H4.47" />
                      </svg>
                    </div>
                    <div className="value-content">
                      <h4>Our Mission</h4>
                      <p>
                        To create impactful events that foster community growth, learning, and connection while
                        providing valuable resources for personal development.
                      </p>
                    </div>
                  </div>

                  <div className="premium-value-item">
                    <div className="value-icon">
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path
                          fill="currentColor"
                          d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z"
                        />
                      </svg>
                    </div>
                    <div className="value-content">
                      <h4>Our Vision</h4>
                      <p>
                        To be the leading provider of transformative events that inspire change and create lasting
                        impact in our communities and beyond.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="premium-newsletter-section">
        <div className="premium-container">
          <div className="premium-newsletter-wrapper">
            <div className="newsletter-decorative-element"></div>
            <div className="premium-newsletter-content">
              <div className="newsletter-header">
                <h2>Stay Connected</h2>
                <p>
                  Interested in our events or have questions? Reach out to us directly for more information about
                  upcoming events, exclusive content, and community news.
                </p>
              </div>
              <div className="premium-contact-info">
                <a href="mailto:jjrsfoundation@gmail.com" className="premium-contact-button">
                  <Mail className="contact-icon" size={18} />
                  jjrsfoundation@gmail.com
                </a>
                <p className="contact-note">We'd love to hear from you and answer any questions you might have!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  )
}

export default GuestEventsPage
