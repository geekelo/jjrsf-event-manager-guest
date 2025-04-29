"use client"

import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"

const HeroSection = () => {
  // Add these new states for the count-up animation
  const [eventCount, setEventCount] = useState(0)
  const [attendeeCount, setAttendeeCount] = useState(0)
  const [speakerCount, setSpeakerCount] = useState(0)

  useEffect(() => {
    const eventTarget = 15
    const attendeeTarget = 500
    const speakerTarget = 10

    const eventDuration = 2000 // 2 seconds
    const attendeeDuration = 2500 // 2.5 seconds
    const speakerDuration = 1500 // 1.5 seconds

    const eventIncrement = eventTarget / (eventDuration / 50)
    const attendeeIncrement = attendeeTarget / (attendeeDuration / 50)
    const speakerIncrement = speakerTarget / (speakerDuration / 50)

    let eventTimer, attendeeTimer, speakerTimer

    if (eventCount < eventTarget) {
      eventTimer = setTimeout(() => {
        setEventCount((prev) => {
          const newValue = prev + eventIncrement
          return newValue >= eventTarget ? eventTarget : newValue
        })
      }, 50)
    }

    if (attendeeCount < attendeeTarget) {
      attendeeTimer = setTimeout(() => {
        setAttendeeCount((prev) => {
          const newValue = prev + attendeeIncrement
          return newValue >= attendeeTarget ? attendeeTarget : newValue
        })
      }, 50)
    }

    if (speakerCount < speakerTarget) {
      speakerTimer = setTimeout(() => {
        setSpeakerCount((prev) => {
          const newValue = prev + speakerIncrement
          return newValue >= speakerTarget ? speakerTarget : newValue
        })
      }, 50)
    }

    return () => {
      clearTimeout(eventTimer)
      clearTimeout(attendeeTimer)
      clearTimeout(speakerTimer)
    }
  }, [eventCount, attendeeCount, speakerCount])

  // Generate random shape positions
  const generateShapes = (count) => {
    const shapes = []
    for (let i = 0; i < count; i++) {
      shapes.push({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: 20 + Math.random() * 80,
        delay: Math.random() * 5,
        duration: 15 + Math.random() * 30,
      })
    }
    return shapes
  }

  const heroShapes = generateShapes(10)

  return (
    <section className="premium-hero-section" id="home">
      {/* Decorative shapes */}
      {heroShapes.map((shape, index) => (
        <div
          key={index}
          className="hero-shape"
          style={{
            top: shape.top,
            left: shape.left,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            animationDelay: `${shape.delay}s`,
            animationDuration: `${shape.duration}s`,
          }}
        ></div>
      ))}

      <div className="premium-hero-glass">
        <div className="premium-hero-content">
          <div className="premium-hero-text">
            <span className="hero-kicker">Welcome to</span>
            <h1>
              <span className="accent-text">JJRS Foundation</span> 
              <br />
              Program Portal
            </h1>
            <p className="premium-hero-description">
            Find and register for upcoming events, stream ongoing events, and watch recordings of past events.
            </p>
            <div className="premium-hero-buttons">
              <a href="#events" className="premium-cta-button">
                Explore Events <ArrowRight size={16} />
              </a>
              <a href="#faqs" className="premium-secondary-button">
                FAQs
              </a>
            </div>
          </div>
          <div className="premium-hero-image">
            <div className="rotating-circles">
              <div className="circle circle1"></div>
              <div className="circle circle2"></div>
              <div className="circle circle3"></div>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{Math.round(eventCount)}+</span>
                <span className="stat-label">Events</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{Math.round(attendeeCount)}+</span>
                <span className="stat-label">Attendees</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{Math.round(speakerCount)}+</span>
                <span className="stat-label">Speakers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
