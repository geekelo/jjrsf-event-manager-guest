"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { createFeedback, fetchFeedbacks } from "../../redux/slices/feedbackSlice"
import { X, Send, MessageSquare } from "lucide-react"

const FeedbackForm = ({ eventId, onClose }) => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.feedback)

  const [name, setName] = useState("")
  const [review, setReview] = useState("")
  const [testimony, setTestimony] = useState("")

  const isValid = review.trim() || testimony.trim()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid) return toast.error("Please write a review or testimony.")

    const payload = {
      name: name.trim() || "Anonymous",
      review: review.trim() || null,
      testimony: testimony.trim() || null,
      eventId,
    }

    try {
      const actionResult = await dispatch(createFeedback(payload))

      if (createFeedback.fulfilled.match(actionResult)) {
        toast.success("Feedback submitted!")
        setName("")
        setReview("")
        setTestimony("")
        dispatch(fetchFeedbacks(eventId))
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        throw new Error(actionResult.payload)
      }
    } catch (err) {
      toast.error(err.message || "Error submitting feedback.")
    }
  }

  return (
    <div className="feedback-modal-overlay">
      <div className="feedback-form-container">
        <button className="feedback-close-button" onClick={onClose}>
          <X size={20} />
        </button>
        <h3 className="feedback-form-title">
          <MessageSquare className="feedback-icon" />
          Share Your Feedback
        </h3>
        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="feedback-form-group">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Your name"
              className="feedback-input"
            />
          </div>
          <div className="feedback-form-group">
            <textarea
              placeholder="Leave a review (optional)"
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              aria-label="Review"
              className="feedback-textarea"
            />
          </div>
          <div className="feedback-form-group">
            <textarea
              placeholder="Share a testimony (optional)"
              rows={3}
              value={testimony}
              onChange={(e) => setTestimony(e.target.value)}
              aria-label="Testimony"
              className="feedback-textarea"
            />
          </div>
          <div className="feedback-note">
            <p>Please fill at least one of the review or testimony fields.</p>
          </div>
          <button type="submit" disabled={!isValid || loading} className="feedback-submit-button">
            <Send size={16} />
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default FeedbackForm
