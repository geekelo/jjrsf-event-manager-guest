"use client"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  FilmIcon,
  ChevronDown,
  ChevronUp,
  Globe,
  Youtube,
  Mic,
  Video,
  Copy,
  Check,
  Code,
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { fetchSingleEvent } from "../redux/slices/eventSlice"
import "../styles/streamView.css"

function StreamView() {
  const navigate = useNavigate()
  const { unique_id } = useParams()
  const dispatch = useDispatch()

  const { singleEvent: event, loading, error } = useSelector((state) => state.events)

  const [isOpen, setIsOpen] = useState(true)
  const [activePlatformId, setActivePlatformId] = useState(0)
  const [showEmbedCode, setShowEmbedCode] = useState(false)
  const [copied, setCopied] = useState(false)

  // Mock platforms data - in a real app, this would come from an API
  const [platforms, setPlatforms] = useState([
    {
      id: 1,
      platform_name: "YouTube",
      embed_link: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      embed_code:
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
      visit_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      views: 245,
    },
    {
      id: 2,
      platform_name: "Zoom",
      embed_link: null,
      embed_code:
        '<div class="zoom-container"><iframe src="https://zoom.us/wc/123456789/join" allow="microphone; camera; fullscreen" style="width:100%; height:100%; border:none;"></iframe></div>',
      visit_link: "https://zoom.us/j/123456789",
      views: 128,
    },
    {
      id: 3,
      platform_name: "Mixlr",
      embed_link: null,
      embed_code:
        '<div class="embed-container" style="background-color:#f5f5f5;display:flex;align-items:center;justify-content:center;"><div style="text-align:center;padding:20px;"><h3 style="margin-bottom:15px;color:#333;">Audio Stream</h3><audio controls style="width:100%;max-width:400px;"><source src="https://example.com/audio.mp3" type="audio/mpeg">Your browser does not support the audio element.</audio></div></div>',
      visit_link: "https://mixlr.com/example",
      views: 87,
    },
    {
      id: 4,
      platform_name: "Facebook",
      embed_link:
        "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F10153231379946729%2F",
      embed_code:
        '<iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F10153231379946729%2F" width="560" height="315" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>',
      visit_link: "https://www.facebook.com/facebook/videos/10153231379946729/",
      views: 156,
    },
  ])

  useEffect(() => {
    if (unique_id) {
      dispatch(fetchSingleEvent(unique_id))
    }
  }, [unique_id, dispatch])

  useEffect(() => {
    // Set first platform as active if available
    if (platforms.length > 0 && activePlatformId === 0) {
      setActivePlatformId(platforms[0].id)
    }
  }, [platforms, activePlatformId])

  const handleBack = () => {
    navigate(`/event/${unique_id}`)
  }

  const toggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  const toggleEmbedCodeDisplay = () => {
    setShowEmbedCode(!showEmbedCode)
    setCopied(false)
  }

  const copyEmbedCode = (code) => {
    navigator.clipboard.writeText(code).then(
      () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      },
      (err) => {
        console.error("Could not copy text: ", err)
      },
    )
  }

  const getPlatformIcon = (name) => {
    switch (name?.toLowerCase()) {
      case "youtube":
        return <Youtube size={20} className="platform-icon youtube-icon" />
      case "mixlr":
        return <Mic size={20} className="platform-icon mixlr-icon" />
      case "zoom":
        return <Video size={20} className="platform-icon zoom-icon" />
      default:
        return <Globe size={20} className="platform-icon default-icon" />
    }
  }

  const getEmbedCodeToDisplay = (platform) => {
    if (platform.embed_code) {
      return platform.embed_code
    } else if (platform.embed_link) {
      return `<iframe 
  src="${platform.embed_link}" 
  title="${platform.platform_name} content" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen
></iframe>`
    }
    return null
  }

  const renderEmbeddedContent = (platform) => {
    if (!platform?.embed_link && !platform?.embed_code) {
      return (
        <div className="no-embed-message">
          <p>No embeddable content available for this platform.</p>
          {platform?.visit_link && (
            <a href={platform.visit_link} target="_blank" rel="noopener noreferrer" className="visit-link">
              <Globe size={16} /> Visit Platform
            </a>
          )}
        </div>
      )
    }

    // If embed code is provided, use it directly
    if (platform.embed_code) {
      return <div className="embed-container" dangerouslySetInnerHTML={{ __html: platform.embed_code }}></div>
    }

    // Otherwise, use the embed link in an iframe
    return (
      <div className="embed-container">
        <iframe
          src={platform.embed_link}
          title={`${platform.platform_name} content`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    )
  }

  const renderEmbedCodeSection = (platform) => {
    const embedCode = getEmbedCodeToDisplay(platform)

    if (!embedCode) return null

    return (
      <div className="embed-code-section">
        <button className="embed-code-toggle" onClick={toggleEmbedCodeDisplay}>
          <Code size={16} />
          {showEmbedCode ? "Hide Embed Code" : "Show Embed Code"}
        </button>

        {showEmbedCode && (
          <div className="embed-code-display">
            <div className="embed-code-header">
              <span>Embed Code</span>
              <button className="copy-code-button" onClick={() => copyEmbedCode(embedCode)} title="Copy to clipboard">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="embed-code-content">{embedCode}</pre>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="manage-stream-page">
        <div className="stream-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <span>Loading stream...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="manage-stream-page">
        <div className="stream-container">
          <div className="error-message">
            <p>Error loading event: {error || "Event not found"}</p>
          </div>
        </div>
      </div>
    )
  }
  d44d270b693fcf092b6ebb50e7e6c781
  return (
    <div className="manage-stream-page">
      <div className="stream-container">
        <div className="stream-header">
          
          <h2>
            <FilmIcon size={24} />
            {event.name} - Live Stream
          </h2>
        </div>

        <div className="stream-accordion-wrapper">
          <div className="stream-accordion">
            <div className="accordion-header" onClick={toggleAccordion}>
              <div className="accordion-title">
                <FilmIcon size={20} className="accordion-icon" /> Event Streams
                <span className="stream-count">{platforms.length}</span>
              </div>
              {isOpen ? <ChevronUp className="accordion-chevron" /> : <ChevronDown className="accordion-chevron" />}
            </div>

            {isOpen && (
              <div className="accordion-content">
                {platforms.length === 0 ? (
                  <div className="no-platforms-message">
                    <p>No streams are currently available for this event.</p>
                  </div>
                ) : (
                  <div className="stream-tabs-container">
                    <div className="platform-tabs">
                      {platforms.map((platform) => (
                        <button
                          key={platform.id}
                          className={`platform-tab ${activePlatformId === platform.id ? "active" : ""}`}
                          onClick={() => setActivePlatformId(platform.id)}
                        >
                          {getPlatformIcon(platform.platform_name)}
                          {platform.platform_name}
                          <span className="view-count">{platform.views ?? 0}</span>
                        </button>
                      ))}
                    </div>

                    {platforms.map(
                      (platform) =>
                        activePlatformId === platform.id && (
                          <div className="stream-content" key={platform.id}>
                            {renderEmbeddedContent(platform)}
                            {renderEmbedCodeSection(platform)}
                          </div>
                        ),
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StreamView
