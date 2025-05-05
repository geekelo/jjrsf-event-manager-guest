"use client"

import { useState, useEffect } from "react"
import { User, Mail, Phone, X, Loader2, Check, Users } from "lucide-react"
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import { quickRegisterForEvent, resetQuickRegistration } from "../../redux/slices/eventSlice"

const QuickRegistrationForm = ({ eventId, onClose }) => {
  const dispatch = useDispatch()
  const { quickRegistrationLoading, quickRegistrationError, quickRegistrationSuccess } = useSelector(
    (state) => state.events,
  )

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    registeringForFamily: "alone", // 'alone' or 'family'
    familyNames: "",
  })

  const [errors, setErrors] = useState({})
  const [isSuccess, setIsSuccess] = useState(false)

  // Reset the registration state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetQuickRegistration())
    }
  }, [dispatch])

  // Handle success and error states from Redux
  useEffect(() => {
    if (quickRegistrationSuccess) {
      setIsSuccess(true)
      toast.success("Quick registration successful!")

      // Reset form after 2 seconds
      setTimeout(() => {
        setIsSuccess(false)
        setFormData({
          name: "",
          email: "",
          phone: "",
          gender: "",
          registeringForFamily: "alone",
          familyNames: "",
        })
        onClose()
      }, 2000)
    }

    if (quickRegistrationError) {
      toast.error(quickRegistrationError || "Failed to register. Please try again.")
    }
  }, [quickRegistrationSuccess, quickRegistrationError, onClose])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required"
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.registeringForFamily === "family" && !formData.familyNames.trim()) {
      newErrors.familyNames = "Please enter family member names"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fill all required fields correctly")
      return
    }

    dispatch(
      quickRegisterForEvent({
        eventId,
        guestData: {
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
          gender: formData.gender,
          registeringForFamily: formData.registeringForFamily,
          familyNames: formData.familyNames || null,
        },
      }),
    )
  }

  if (isSuccess) {
    return (
      <div className="quick-registration-overlay">
        <div className="quick-registration-form success">
          <div className="quick-reg-header">
            <h3>Registration Successful!</h3>
            <button onClick={onClose} className="close-button">
              <X size={18} />
            </button>
          </div>
          <div className="success-message">
            <div className="success-icon">
              <Check size={40} />
            </div>
            <p>Thank you for your interest in this event!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="quick-registration-overlay">
      <div className="quick-registration-form">
        <div className="quick-reg-header">
          <h3>Quick Registration</h3>
          <button onClick={onClose} className="close-button">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="quick-reg-field">
            <label htmlFor="name">
              Full Name <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <User size={16} className="input-icon" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.name ? "error" : ""}
              />
            </div>
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>

          <div className="quick-reg-field">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={errors.email ? "error" : ""}
              />
            </div>
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="quick-reg-field">
            <label htmlFor="phone">Phone</label>
            <div className="input-wrapper">
              <Phone size={16} className="input-icon" />
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div className="quick-reg-field">
            <label htmlFor="gender">
              Gender <span className="required">*</span>
            </label>
            <div className="select-wrapper">
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={errors.gender ? "error" : ""}
              >
                <option value="">Select gender</option>
                <option value="f">Female</option>
                <option value="m">Male</option>
              </select>
            </div>
            {errors.gender && <p className="error-message">{errors.gender}</p>}
          </div>

          {/* === NEW SECTION === */}
          <div >
            <label>Are you registering for your family?</label>
            <div >
              <label>
                <input
                  type="radio"
                  name="registeringForFamily"
                  value="alone"
                  checked={formData.registeringForFamily === "alone"}
                  onChange={handleChange}
                />
                Just me alone
              </label>
              <label>
                <input
                  type="radio"
                  name="registeringForFamily"
                  value="family"
                  checked={formData.registeringForFamily === "family"}
                  onChange={handleChange}
                />
                Yes, include family
              </label>
            </div>
          </div>

          {formData.registeringForFamily === "family" && (
            <div className="quick-reg-field">
              <label htmlFor="familyNames">
                Family Members' Names <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <Users size={16} className="input-icon" />
                <input
                  type="text"
                  id="familyNames"
                  name="familyNames"
                  value={formData.familyNames}
                  onChange={handleChange}
                  placeholder="Enter names separated by commas"
                  className={errors.familyNames ? "error" : ""}
                />
              </div>
              <small className="note">Please separate each name with a comma (e.g., John Doe, Jane Doe)</small>
              {errors.familyNames && <p className="error-message">{errors.familyNames}</p>}
            </div>
          )}
          {/* === END NEW SECTION === */}

          <div className="quick-reg-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={quickRegistrationLoading}>
              {quickRegistrationLoading ? (
                <>
                  <Loader2 size={16} className="spinner-icon" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuickRegistrationForm
