"use client"

import { useState } from "react"
import { MessageSquare } from "lucide-react"
import FeedbackForm from "./FeedbackForm"

const FloatingFeedbackButton = ({ eventId }) => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)

  const toggleFeedbackForm = () => {
    setShowFeedbackForm(!showFeedbackForm)
  }

  return (
    <>
      <button className="floating-feedback-button" onClick={toggleFeedbackForm}>
        <MessageSquare size={20} />
        <span>Give your Comments</span>
      </button>

      {showFeedbackForm && <FeedbackForm eventId={eventId} onClose={() => setShowFeedbackForm(false)} />}
    </>
  )
}

export default FloatingFeedbackButton
