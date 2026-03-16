import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { auth, googleProvider } from "../config/firebase"
import { signInWithPopup } from "firebase/auth"   // ← remove ProviderId
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { serverUrl } from "../App"
import { getCurrentUser } from "../services/api"
import { useDispatch } from "react-redux"


const ease = [0.22, 1, 0.36, 1]
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}

const features = [
  { icon: "🎁", title: "50 Free Credits",   desc: "Start generating notes right away — no payment needed." },
  { icon: "📘", title: "Exam Notes",         desc: "High-yield, revision-ready exam-oriented notes." },
  { icon: "📁", title: "Project Notes",      desc: "Well-structured documentation for assignments & projects." },
  { icon: "📊", title: "Charts & Graphs",    desc: "Auto-generated diagrams, charts and flow graphs." },
  { icon: "⬇️", title: "Free PDF Download", desc: "Download clean, printable PDFs instantly." },
  { icon: "⚡", title: "Instant Access",     desc: "No setup. Sign in and your workspace is ready." },
]

function FloatingNote({ style, delay, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { duration: 0.6, delay },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
      }}
      style={{
        position: "absolute",
        background: "#fff",
        border: "1px solid #e8e4df",
        borderRadius: 14,
        padding: "14px 18px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)",
        fontSize: 13,
        color: "#333",
        fontFamily: "'Lora', serif",
        maxWidth: 200,
        lineHeight: 1.5,
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}

function Feature({ icon, title, desc }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      variants={fadeUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#faf8f5" : "#fff",
        border: `1px solid ${hovered ? "#d9d3cb" : "#ede9e3"}`,
        borderRadius: 16,
        padding: "22px 20px",
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
        cursor: "default",
        transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.07)" : "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ fontSize: 22, lineHeight: 1, marginTop: 2, flexShrink: 0 }}>{icon}</div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#1a1714", marginBottom: 4, fontFamily: "'Lora', serif" }}>{title}</p>
        <p style={{ fontSize: 13, color: "#888480", lineHeight: 1.55, fontFamily: "'Lora', serif", fontWeight: 400 }}>{desc}</p>
      </div>
    </motion.div>
  )
}

export default function Auth() {
  const navigate = useNavigate()
   const dispatch = useDispatch()  
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    const link = Object.assign(document.createElement("link"), {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Epilogue:wght@300;400;500&display=swap",
    })
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await signInWithPopup(auth, googleProvider)
      const idToken = await response.user.getIdToken()

      const res = await axios.post(
        serverUrl + "/api/auth/google",
        { idToken },
        { withCredentials: true }
      )

      localStorage.setItem("token", res.data.token)
      await getCurrentUser(dispatch)   // ← dispatch works now (inside component)
      navigate("/")
    } catch (err) {
      console.error(err)
      setError("Sign-in failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f1eb",
      fontFamily: "'Epilogue', sans-serif",
      overflow: "hidden",
      position: "relative",
    }}>
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        pointerEvents: "none", opacity: 0.6,
      }} />

      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "#1a1714", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📝</div>
          <span style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 18, color: "#1a1714", letterSpacing: "-0.01em" }}>
            ExamNote <span style={{ color: "#b07d3a" }}>AI</span>
          </span>
        </div>
        <p style={{ fontSize: 13, color: "#a09b94", fontWeight: 400 }}>AI-powered exam notes & revision</p>
      </motion.header>

      <main style={{
        maxWidth: 1240, margin: "0 auto", padding: "32px 40px 80px",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center",
      }}>
        {/* LEFT */}
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.div variants={fadeUp} style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "#fff", border: "1px solid #e2ddd5", borderRadius: 99,
            padding: "5px 14px 5px 8px", marginBottom: 28,
          }}>
            <span style={{ fontSize: 14 }}>🎓</span>
            <span style={{ fontSize: 12, fontWeight: 500, color: "#b07d3a", fontFamily: "'Lora', serif" }}>Start free — 50 credits included</span>
          </motion.div>

          <motion.h1 variants={fadeUp} style={{
            fontFamily: "'Lora', serif", fontSize: "clamp(38px, 5vw, 58px)",
            fontWeight: 700, color: "#1a1714", lineHeight: 1.1,
            letterSpacing: "-0.02em", marginBottom: 20,
          }}>
            Unlock Smart<br />
            <span style={{ background: "linear-gradient(120deg, #b07d3a, #d4a85a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              AI Notes
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} style={{ fontSize: 15, color: "#7a7570", lineHeight: 1.7, maxWidth: 400, marginBottom: 36, fontWeight: 400 }}>
            Generate exam-ready notes, project docs, charts & graphs — then download clean PDFs instantly. All powered by AI.
          </motion.p>

          {/* ✅ onClick added, loading state, spinner */}
          <motion.button
            variants={fadeUp}
            onClick={handleGoogleSignIn}
            disabled={loading}
            whileHover={!loading ? { scale: 1.02, boxShadow: "0 12px 40px rgba(0,0,0,0.14)" } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              background: loading ? "#3a3330" : "#1a1714",
              color: "#f5f1eb", border: "none", borderRadius: 14,
              padding: "14px 28px", fontSize: 15, fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Epilogue', sans-serif", letterSpacing: "0.01em",
              boxShadow: "0 4px 20px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.06)",
              transition: "background 0.2s, box-shadow 0.2s",
              marginBottom: 8, opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <svg width="20" height="20" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}>
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" fill="none"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {loading ? "Signing in..." : "Continue with Google"}
          </motion.button>

          {/* ✅ Error message */}
          {error && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: 13, color: "#c0392b", marginBottom: 16 }}>
              {error}
            </motion.p>
          )}

          <motion.div variants={fadeUp} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 20 }}>
            {["50 free credits", "Upgrade anytime", "Instant access"].map((t, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#a09b94" }}>
                {i > 0 && <span style={{ color: "#d9d3cb" }}>·</span>}
                <span style={{ color: "#b07d3a", fontSize: 11 }}>✓</span> {t}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT */}
        <div style={{ position: "relative" }}>
          <FloatingNote delay={0.6} style={{ top: -24, right: -16, transform: "rotate(2deg)", zIndex: 2 }}>
            <span style={{ fontSize: 11, color: "#b07d3a", fontWeight: 600, display: "block", marginBottom: 4 }}>📌 Exam tip</span>
            Mitochondria is the powerhouse of the cell — remember the ATP synthesis cycle!
          </FloatingNote>
          <FloatingNote delay={0.9} style={{ bottom: -20, left: -20, transform: "rotate(-1.5deg)", zIndex: 2 }}>
            <span style={{ fontSize: 11, color: "#4a7c59", fontWeight: 600, display: "block", marginBottom: 4 }}>✅ Generated</span>
            Chapter 5 notes ready — 3 charts included.
          </FloatingNote>
          <motion.div variants={stagger} initial="hidden" animate="show"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, position: "relative", zIndex: 1 }}>
            {features.map((f, i) => <Feature key={i} {...f} />)}
          </motion.div>
        </div>
      </main>
    </div>
  )
}