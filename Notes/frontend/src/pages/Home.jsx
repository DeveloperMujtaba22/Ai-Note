import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { motion } from "motion/react"
import logo from "../assets/logo.png"
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'

const ease = [0.22, 1, 0.36, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

// ── Design tokens ──
const BG      = "#0f172a"
const ACCENT  = "#3b82f6"
const ACCENT2 = "#60a5fa"
const ACCENTGL= "rgba(59,130,246,0.12)"
const TEXT    = "#f0f6ff"
const MUTED   = "rgba(240,246,255,0.45)"
const BORDER  = "rgba(255,255,255,0.07)"
const CARD    = "rgba(255,255,255,0.035)"

const features = [
  { icon: "📘", title: "Exam Notes",   desc: "High-yield, revision-ready notes built for exam success.",   color: "#3b82f6", glow: "rgba(59,130,246,0.1)"  },
  { icon: "📁", title: "Project Docs", desc: "Structured documentation for assignments and projects.",     color: "#10b981", glow: "rgba(16,185,129,0.1)"  },
  { icon: "📊", title: "Diagrams",     desc: "Auto-generated flow charts, mind maps and comparisons.",    color: "#f59e0b", glow: "rgba(245,158,11,0.1)"  },
  { icon: "⬇️", title: "PDF Export",  desc: "Download clean, print-ready PDFs in one click.",            color: "#ec4899", glow: "rgba(236,72,153,0.1)"  },
]

const steps = [
  { n: "01", title: "Enter your topic",    desc: "Type any subject, chapter, or concept you need notes on." },
  { n: "02", title: "AI builds the notes", desc: "Structured sections, key terms and revision points generated instantly." },
  { n: "03", title: "Save or export",      desc: "Keep in your library or download a polished PDF immediately." },
]

const PREVIEW_LINES = [
  { type: "heading",    text: "Photosynthesis — Ch. 4" },
  { type: "subheading", text: "Overview" },
  { type: "line", w: "88%" }, { type: "line", w: "74%" }, { type: "line", w: "60%" },
  { type: "subheading", text: "Key Concepts" },
  { type: "line", w: "82%" }, { type: "line", w: "66%" }, { type: "line", w: "50%" },
  { type: "subheading", text: "Exam Tips" },
  { type: "line", w: "78%" }, { type: "line", w: "55%" },
]

function NotePreview() {
  
  const [revealed, setRevealed] = useState(0)
  useEffect(() => {
    if (revealed >= PREVIEW_LINES.length) return
    const t = setTimeout(() => setRevealed(r => r + 1), 200)
    return () => clearTimeout(t)
  }, [revealed])

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, rotate: 1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 1.5 }}
      transition={{ delay: 0.55, duration: 0.8, ease }}
      style={{
        background: "rgba(10,18,40,0.96)",
        border: `1px solid rgba(59,130,246,0.22)`,
        borderRadius: 18,
        padding: "22px 24px",
        boxShadow: `0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(59,130,246,0.07)`,
        width: 290, position: "relative",
      }}
    >
      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {["#ff5f57","#febc2e","#28c840"].map(c => (
          <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.75 }} />
        ))}
        <div style={{ marginLeft: 6, height: 7, width: 70, background: "rgba(255,255,255,0.06)", borderRadius: 3 }} />
      </div>

      {PREVIEW_LINES.slice(0, revealed).map((line, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22 }}
          style={{ marginBottom: line.type === "heading" ? 16 : line.type === "subheading" ? 10 : 7 }}
        >
          {line.type === "heading"    && <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: "'Lora', serif" }}>{line.text}</span>}
          {line.type === "subheading" && <span style={{ fontSize: 10, fontWeight: 700, color: ACCENT2, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'Lora', serif" }}>{line.text}</span>}
          {line.type === "line"       && <div style={{ width: line.w, height: 8, background: "rgba(255,255,255,0.07)", borderRadius: 4 }} />}
        </motion.div>
      ))}

      {revealed < PREVIEW_LINES.length && (
        <motion.div animate={{ opacity: [1,0] }} transition={{ duration: 0.5, repeat: Infinity }}
          style={{ width: 2, height: 12, background: ACCENT, borderRadius: 1 }} />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.6, duration: 0.4, ease }}
        style={{
          position: "absolute", top: -13, right: -13,
          background: `linear-gradient(135deg, ${ACCENT}, #1d4ed8)`,
          color: "#fff", borderRadius: 99, padding: "5px 12px",
          fontSize: 11, fontWeight: 700,
          boxShadow: `0 4px 16px rgba(59,130,246,0.45)`,
          fontFamily: "'Lora', serif",
        }}
      >✨ AI Generated</motion.div>
    </motion.div>
  )
}

function FeatureCard({ icon, title, desc, color, glow }) {
  const [h, setH] = useState(false)
  return (
    <motion.div variants={fadeUp}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: h ? glow : CARD,
        border: `1px solid ${h ? color + "44" : BORDER}`,
        borderRadius: 18, padding: "26px 22px", cursor: "default",
        transition: "all 0.25s", boxShadow: h ? `0 12px 40px ${color}18` : "none",
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 11,
        background: glow, border: `1px solid ${color}33`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, marginBottom: 16,
        transform: h ? "scale(1.1)" : "scale(1)", transition: "transform 0.2s",
      }}>{icon}</div>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: "'Lora', serif", marginBottom: 7 }}>{title}</h3>
      <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65, fontFamily: "'Lora', serif" }}>{desc}</p>
    </motion.div>
  )
}

function StepItem({ n, title, desc }) {
  return (
    <motion.div variants={fadeUp} style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        background: ACCENTGL, border: `1px solid rgba(59,130,246,0.22)`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: ACCENT2, fontFamily: "'Lora', serif" }}>{n}</span>
      </div>
      <div>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: "'Lora', serif", marginBottom: 5 }}>{title}</h4>
        <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, fontFamily: "'Lora', serif" }}>{desc}</p>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", fn)
    return () => window.removeEventListener("resize", fn)
  }, [])

  useEffect(() => {
    const link = Object.assign(document.createElement("link"), {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Epilogue:wght@300;400;500;600&display=swap",
    })
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'Epilogue', sans-serif", overflowX: "hidden" }}>

      {/* Ambient glows */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)",
          width: 900, height: 600,
          background: "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.13) 0%, transparent 60%)",
        }} />
        <div style={{
          position: "absolute", bottom: "15%", right: "-5%",
          width: 500, height: 500,
          background: "radial-gradient(ellipse, rgba(59,130,246,0.05) 0%, transparent 65%)",
        }} />
      </div>

      {/* Subtle grid */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      <Navbar />

      {/* ── HERO ── */}
      <section style={{
        maxWidth: 1100, margin: "0 auto",
        padding: isMobile ? "120px 24px 72px" : "140px 40px 96px",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: isMobile ? 56 : 64,
        alignItems: "center",
        position: "relative", zIndex: 1,
      }}>
        <motion.div variants={stagger} initial="hidden" animate="show">

          <motion.div variants={fadeUp} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: ACCENTGL, border: `1px solid rgba(59,130,246,0.25)`,
            borderRadius: 99, padding: "5px 14px 5px 8px", marginBottom: 28,
          }}>
            <span style={{ fontSize: 14 }}>🎓</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: ACCENT2, fontFamily: "'Lora', serif" }}>
              50 free credits — no card required
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} style={{
            fontFamily: "'Lora', serif",
            fontSize: isMobile ? "clamp(32px, 8vw, 44px)" : "clamp(42px, 4.5vw, 60px)",
            fontWeight: 700, color: TEXT,
            lineHeight: 1.08, letterSpacing: "-0.025em", marginBottom: 22,
          }}>
            Create Smart<br />
            <span style={{
              background: `linear-gradient(120deg, ${ACCENT2}, #93c5fd)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>AI Notes</span>{" "}in Seconds
          </motion.h1>

          <motion.p variants={fadeUp} style={{ fontSize: 15, color: MUTED, lineHeight: 1.75, maxWidth: 420, marginBottom: 38 }}>
            Generate exam-focused notes, project documentation, flow diagrams and revision-ready content — faster, cleaner, smarter.
          </motion.p>

          <motion.div variants={fadeUp} style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
            <motion.button 
            onClick={() =>navigate("/notes")}
              whileHover={{ scale: 1.03, boxShadow: `0 16px 48px rgba(59,130,246,0.4)` }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: `linear-gradient(135deg, ${ACCENT}, #1d4ed8)`,
                color: "#fff", border: "none", borderRadius: 12,
                padding: "13px 26px", fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: "'Epilogue', sans-serif",
                boxShadow: `0 4px 24px rgba(59,130,246,0.35)`,
              }}
            >
              <span>✏️</span> Generate Notes
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, background: "rgba(255,255,255,0.07)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.04)",
                color: "rgba(240,246,255,0.65)",
                border: `1px solid ${BORDER}`,
                borderRadius: 12, padding: "13px 22px",
                fontSize: 14, fontWeight: 500,
                cursor: "pointer", fontFamily: "'Epilogue', sans-serif",
                transition: "background 0.2s",
              }}
            >
              View example →
            </motion.button>
          </motion.div>

          <motion.div variants={fadeUp} style={{ display: "flex", gap: 32, paddingTop: 28, borderTop: `1px solid ${BORDER}` }}>
            {[["10k+","Notes created"],["50","Free credits"],["4.9★","Student rating"]].map(([v,l]) => (
              <div key={l}>
                <p style={{ fontSize: 20, fontWeight: 700, color: ACCENT2, fontFamily: "'Lora', serif", marginBottom: 2 }}>{v}</p>
                <p style={{ fontSize: 11, color: MUTED, fontFamily: "'Lora', serif" }}>{l}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {!isMobile && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
            <div style={{
              position: "absolute", width: 340, height: 340, borderRadius: "50%",
              background: `radial-gradient(ellipse, rgba(59,130,246,0.14) 0%, transparent 70%)`,
            }} />
            <NotePreview />
          </div>
        )}
      </section>

      {/* ── FEATURES ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "48px 24px" : "72px 40px", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease }}
          style={{ textAlign: "center", marginBottom: 52 }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: ACCENT2, textTransform: "uppercase", fontFamily: "'Lora', serif", marginBottom: 12 }}>
            What you get
          </p>
          <h2 style={{ fontFamily: "'Lora', serif", fontSize: isMobile ? 26 : 34, fontWeight: 700, color: TEXT, letterSpacing: "-0.02em" }}>
            Everything to ace your studies
          </h2>
        </motion.div>

        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
          style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 14 }}
        >
          {features.map((f, i) => <FeatureCard key={i} {...f} />)}
        </motion.div>
      </section>

    

      {/* ── CTA ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "48px 24px 88px" : "64px 40px 110px", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease }}
          style={{
            background: `linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0.03) 100%)`,
            border: `1px solid rgba(59,130,246,0.18)`,
            borderRadius: 24,
            padding: isMobile ? "40px 28px" : "56px 60px",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            gap: 28, position: "relative", overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", right: -80, top: -80, width: 360, height: 360, background: `radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)`, pointerEvents: "none" }} />
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: ACCENT2, textTransform: "uppercase", fontFamily: "'Lora', serif", marginBottom: 10 }}>Start today</p>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: isMobile ? 22 : 28, fontWeight: 700, color: TEXT, letterSpacing: "-0.02em", marginBottom: 10 }}>
              50 free credits. No card needed.
            </h2>
            <p style={{ fontSize: 14, color: MUTED, fontFamily: "'Lora', serif" }}>Start generating exam notes now. Upgrade when you're ready.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: `0 16px 48px rgba(59,130,246,0.45)` }}
            whileTap={{ scale: 0.96 }}
            style={{
              flexShrink: 0,
              background: `linear-gradient(135deg, ${ACCENT}, #1d4ed8)`,
              color: "#fff", border: "none", borderRadius: 12,
              padding: "14px 32px", fontSize: 15, fontWeight: 700,
              cursor: "pointer", fontFamily: "'Epilogue', sans-serif",
              boxShadow: `0 4px 24px rgba(59,130,246,0.35)`,
              whiteSpace: "nowrap",
            }}
          >
            ✏️ Start for free
          </motion.button>
        </motion.div>
      </section>
      <Footer/>
    </div>
  ) 
}