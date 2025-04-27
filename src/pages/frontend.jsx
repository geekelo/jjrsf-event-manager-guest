"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { authenticateFrontDesk } from "../redux/slices/frontdeskSlice"
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"
import "../styles/front.css"
import "react-toastify/dist/ReactToastify.css"
import { Key, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react"

export default function FrontDeskLogin() {
  const { unique_id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [passcode, setPasscode] = useState("")
  const [showPasscode, setShowPasscode] = useState(false)
  const { loading, error, frontDeskData } = useSelector((state) => state.frontdesk)

  const togglePasscodeVisibility = () => {
    setShowPasscode(!showPasscode)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!passcode.trim()) {
      toast.error("Please enter a passcode")
      return
    }

    // Dispatch authentication
    const result = await dispatch(authenticateFrontDesk({ unique_id, passcode }))

    if (authenticateFrontDesk.fulfilled.match(result)) {
      toast.success("Authenticated successfully!")
      setTimeout(() => {
        navigate(`/event/frontdesk/${unique_id}/admit`)
      }, 1500)
    } else if (authenticateFrontDesk.rejected.match(result)) {
      const errorMessage = result?.payload || "Wrong passcode. Please try again."
      toast.error(errorMessage)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Verifying credentials...</p>
      </div>
    )
  }

  return (
    <div className="front-desk-container">
      <form onSubmit={handleSubmit} className="front-desk-form">
        <div className="front-desk-logo">
          <img src="/jjrsf-logo.png" alt="JJRSF Logo" />
          <div className="front-desk-logo-text">
            <h2>JJRSF</h2>
            <span>Event Management</span>
          </div>
        </div>

        <h2 className="front-desk-title">Front Desk Access</h2>
        <p className="front-desk-subtitle">Enter the event passcode to continue</p>

        <div className="input-group">
          <Key className="input-icon" size={18} />
          <input
            type={showPasscode ? "text" : "password"}
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Enter passcode"
            className="front-desk-input"
            disabled={loading}
          />
          <button 
            type="button" 
            className="visibility-toggle" 
            onClick={togglePasscodeVisibility}
            aria-label={showPasscode ? "Hide passcode" : "Show passcode"}
          >
            {showPasscode ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="front-desk-submit-btn">
          {loading ? (
            <>
              <Loader2 size={18} className="spinner-icon" />
              Verifying...
            </>
          ) : (
            "Access Event"
          )}
        </button>

        <div className="front-desk-footer">
          <p>
            Return to <a href="/">event listings</a>
          </p>
        </div>
      </form>
    </div>
  )
}
