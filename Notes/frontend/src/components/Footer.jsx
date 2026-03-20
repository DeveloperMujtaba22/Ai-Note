import React, { useState } from 'react'
import { motion } from "motion/react"
import logo from "../assets/logo.png"

const ease = [0.22, 1, 0.36, 1]

const ACCENT  = "#3b82f6"
const ACCENT2 = "#60a5fa"
const TEXT    = "#f0f6ff"
const MUTED   = "rgba(240,246,255,0.4)"
const BORDER  = "rgba(255,255,255,0.07)"

const links = {
  Product:  ["Generate Notes", "PDF Export", "Diagrams", "Pricing"],
  Students: ["Exam Notes", "Project Docs", "Quick Summary", "History"],
  Company:  ["About", "Blog", "Careers", "Contact"],
}

function FooterLink({ label }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.a
      href="#"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: 13,
        color: hovered ? ACCENT2 : MUTED,
        textDecoration: "none",
        fontFamily: "'Lora', serif",
        transition: "color 0.18s",
        display: "block",
        marginBottom: 10,
      }}
    >
      {label}
    </motion.a>
  )
}

const Footer = () => {
  const [email, setEmail]           = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [isMobile, setIsMobile]     = useState(window.innerWidth < 768)

  React.useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", fn)
    return () => window.removeEventListener("resize", fn)
  }, [])

  const handleSubscribe = () => {
    if (email.includes("@")) {
      setSubscribed(true)
      setEmail("")
    }
  }

  return (
    <footer style={{
      background: "#080e1c",
      borderTop: `1px solid ${BORDER}`,
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Epilogue', sans-serif",
    }}>

      {/* Top glow */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 700, height: 200, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 65%)",
      }} />

      {/* Main content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "48px 24px 32px" : "64px 40px 40px" }}>

        {/* Top row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr",
          gap: isMobile ? 32 : 40,
          marginBottom: isMobile ? 36 : 56,
        }}>

          {/* Brand col — full width on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            style={isMobile ? { gridColumn: "1 / -1" } : {}}
          >
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                overflow: "hidden", flexShrink: 0,
                border: `1px solid rgba(59,130,246,0.2)`,
              }}>
                <img src={logo} alt="ExamNote AI" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <span style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 17, color: TEXT }}>
                ExamNote <span style={{ color: ACCENT2 }}>AI</span>
              </span>
            </div>

            <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.7, maxWidth: 240, fontFamily: "'Lora', serif", marginBottom: 24 }}>
              ExamNote AI helps students generate high-quality notes, diagrams and revision content instantly — powered by AI.
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { icon: "𝕏", label: "Twitter" },
                { icon: "in", label: "LinkedIn" },
                { icon: "▲", label: "GitHub" },
              ].map(({ icon, label }) => (
                <SocialIcon key={label} icon={icon} />
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, items], i) => (
            <motion.div
              key={heading}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 * (i + 1), ease }}
            >
              <p style={{
                fontSize: 11, fontWeight: 700,
                color: ACCENT2, textTransform: "uppercase",
                letterSpacing: "0.1em", fontFamily: "'Lora', serif",
                marginBottom: 16,
              }}>
                {heading}
              </p>
              {items.map(l => <FooterLink key={l} label={l} />)}
            </motion.div>
          ))}
        </div>

        {/* Newsletter strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
          style={{
            background: "rgba(59,130,246,0.07)",
            border: `1px solid rgba(59,130,246,0.15)`,
            borderRadius: 16,
            padding: isMobile ? "20px 20px" : "24px 28px",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
            justifyContent: "space-between",
            gap: isMobile ? 16 : 24,
            marginBottom: isMobile ? 28 : 40,
          }}
        >
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: "'Lora', serif", marginBottom: 4 }}>
              Study tips & updates
            </p>
            <p style={{ fontSize: 12, color: MUTED, fontFamily: "'Lora', serif" }}>
              Get weekly exam strategies and product news.
            </p>
          </div>

          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <span style={{ fontSize: 16 }}>✅</span>
              <span style={{ fontSize: 13, color: ACCENT2, fontFamily: "'Lora', serif', fontWeight: 600" }}>
                You're subscribed!
              </span>
            </motion.div>
          ) : (
            <div style={{ display: "flex", gap: 8, flexShrink: 0, width: isMobile ? "100%" : "auto" }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubscribe()}
                placeholder="your@email.com"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid rgba(59,130,246,0.2)`,
                  borderRadius: 9, padding: "9px 14px",
                  fontSize: 13, color: TEXT,
                  outline: "none", fontFamily: "'Epilogue', sans-serif",
                  width: isMobile ? "100%" : 200,
                  flex: isMobile ? 1 : "none",
                  boxSizing: "border-box",
                }}
              />
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 8px 24px rgba(59,130,246,0.35)" }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSubscribe}
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}, #1d4ed8)`,
                  color: "#fff", border: "none",
                  borderRadius: 9, padding: "9px 18px",
                  fontSize: 13, fontWeight: 600,
                  cursor: "pointer", fontFamily: "'Epilogue', sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                Subscribe
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Bottom bar */}
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          textAlign: isMobile ? "center" : "left",
          paddingTop: 24,
          borderTop: `1px solid ${BORDER}`,
          gap: isMobile ? 14 : 12,
        }}>
          <p style={{ fontSize: 12, color: MUTED, fontFamily: "'Lora', serif" }}>
            © {new Date().getFullYear()} ExamNote AI. All rights reserved.
          </p>

          <div style={{ display: "flex", gap: isMobile ? 16 : 20, flexWrap: "wrap", justifyContent: "center" }}>
            {["Privacy Policy", "Terms of Use", "Cookie Policy"].map(item => (
              <FooterLink key={item} label={item} />
            ))}
          </div>

          {/* Credits pill */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(59,130,246,0.08)",
            border: `1px solid rgba(59,130,246,0.15)`,
            borderRadius: 99, padding: "4px 12px",
          }}>
            <span style={{ fontSize: 11 }}>⚡</span>
            <span style={{ fontSize: 11, color: ACCENT2, fontFamily: "'Lora', serif", fontWeight: 600 }}>
              Powered by Claude AI
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ icon }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.a
      href="#"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.93 }}
      style={{
        width: 34, height: 34, borderRadius: 9,
        background: hovered ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.05)",
        border: `1px solid ${hovered ? "rgba(59,130,246,0.3)" : BORDER}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 700,
        color: hovered ? ACCENT2 : MUTED,
        textDecoration: "none",
        transition: "all 0.18s",
        cursor: "pointer",
      }}
    >
      {icon}
    </motion.a>
  )
}

export default Footer