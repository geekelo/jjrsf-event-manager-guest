"use client"

import { useState } from "react"
import { User, ChevronDown } from "lucide-react"

const FAQsSection = () => {
  const [activeFaq, setActiveFaq] = useState(null)

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  // FAQ data
  const faqs = [
    {
      question: "How do I register for an event?",
      answer:
        "To register for an event, navigate to the event details page and click on the 'Register Now' button. Follow the instructions to complete your registration. You'll receive a confirmation email with further details.",
    },
    {
      question: "Can I attend events online?",
      answer:
        "Yes, many of our events offer online attendance options. Look for the 'Online' tag on the event card or check the event details page for information about virtual participation.",
    },
    {
      question: "How can I access event materials after attending?",
      answer:
        "Event materials such as presentations, recordings, and additional resources are typically made available to registered attendees through our portal. You'll receive access instructions via email after the event.",
    },
    {
      question: "What is the cancellation policy?",
      answer:
        "Our standard cancellation policy allows for full refunds up to 7 days before the event. Between 7 days and 48 hours, a 50% refund is available. No refunds are provided for cancellations less than 48 hours before the event. Please check specific event details as policies may vary.",
    },
    {
      question: "How can I become a speaker at your events?",
      answer:
        "We're always looking for knowledgeable speakers to share insights at our events. Please contact us at speakers@jjrsfoundation.org with your area of expertise and speaking experience, and our team will get back to you.",
    },
  ]

  return (
    <section className="premium-faqs-section" id="faqs">
      <div className="premium-container">
        <div className="premium-section-intro">
          <div className="premium-section-header">
            <span className="section-kicker">Have Questions?</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="section-decorator">
            <span></span>
            <User className="decorator-icon" size={14} />
            <span></span>
          </div>
        </div>

        <div className="premium-faqs">
          {faqs.map((faq, index) => (
            <div key={index} className={`premium-faq-item ${activeFaq === index ? "active" : ""}`}>
              <div className="premium-faq-question" onClick={() => toggleFaq(index)}>
                <h3>{faq.question}</h3>
                <div className="premium-faq-toggle">
                  <ChevronDown size={16} />
                </div>
              </div>
              <div className="premium-faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQsSection
