import React, { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { generateNotes } from "../services/api"

const ease = [0.22, 1, 0.36, 1]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease, delay },
})

const ACCENT  = "#3b82f6"
const BORDER  = "rgba(255,255,255,0.08)"
const CARD    = "rgba(255,255,255,0.04)"
const TEXT    = "#f0f6ff"
const MUTED   = "rgba(240,246,255,0.45)"

const TOGGLES = [
  { key: "revisionMode",  icon: "📌", label: "Revision mode",   sub: "Ultra-short bullet-only notes"  },
  { key: "includeDiagram",icon: "📊", label: "Include diagram", sub: "Flow charts & process maps"      },
  { key: "includeChart",  icon: "📈", label: "Include chart",   sub: "Comparison & data visuals"       },
]

export default function Topic({ setResult, setLoading, loading, setError }) {
  const [topic,        setTopic]        = useState("")
  const [classLevel,   setClassLevel]   = useState("")
  const [examType,     setExamType]     = useState("")
  const [revisionMode,   setRevisionMode]   = useState(false)
  const [includeDiagram, setIncludeDiagram] = useState(false)
  const [includeChart,   setIncludeChart]   = useState(false)

  const toggleMap = {
    revisionMode:   [revisionMode,   setRevisionMode],
    includeDiagram: [includeDiagram, setIncludeDiagram],
    includeChart:   [includeChart,   setIncludeChart],
  }

  const handleSubmit = async () => {
    if (!topic.trim()) { setError("Please enter a topic"); return }
    setError("")
    setLoading(true)
    setResult(null)
    try {
      // ✅ Fix 1: await was missing
      const result = await generateNotes({
        topic, classLevel, examType,
        revisionMode, includeDiagram, includeChart,
      })
      setResult(result.data)
    } catch (err) {
      console.error(err)
      setError("Failed to fetch notes from server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      {...fadeUp(0)}
      style={{
        maxWidth: 560, margin: "0 auto", padding: "0 16px",
        fontFamily: "'Epilogue', sans-serif",
      }}
    >
      {/* Card */}
      <div style={{
        background: "rgba(15,23,42,0.8)",
        border: `1px solid rgba(59,130,246,0.15)`,
        borderRadius: 20, padding: "28px 24px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
      }}>

        {/* Header */}
        <motion.div {...fadeUp(0.05)} style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 17, fontWeight: 600, color: TEXT, fontFamily: "'Lora', serif" }}>
            Generate notes
          </p>
          <p style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>
            Fill in the details and let AI do the work
          </p>
        </motion.div>

        {/* Topic input */}
        <motion.div {...fadeUp(0.1)} style={{ marginBottom: 14 }}>
          <Label>Topic</Label>
          <TextInput
            value={topic}
            onChange={setTopic}
            placeholder="e.g. Photosynthesis, French Revolution…"
            autoFocus
          />
        </motion.div>

        {/* Class + Exam row */}
        <motion.div
          {...fadeUp(0.15)}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}
        >
          <div>
            <Label>Class / Level</Label>
            <TextInput value={classLevel} onChange={setClassLevel} placeholder="e.g. Class 10" />
          </div>
          <div>
            <Label>Exam type</Label>
            <TextInput value={examType} onChange={setExamType} placeholder="e.g. CBSE, JEE" />
          </div>
        </motion.div>

        {/* Toggles */}
        <motion.div {...fadeUp(0.2)} style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
          {TOGGLES.map(({ key, icon, label, sub }, i) => {
            const [val, setVal] = toggleMap[key]
            return (
              <Toggle
                key={key}
                icon={icon}
                label={label}
                sub={sub}
                checked={val}
                delay={0.22 + i * 0.06}
                onChange={() => setVal(v => !v)}
              />
            )
          })}
        </motion.div>

        {/* Button */}
        <motion.div {...fadeUp(0.38)}>
          <motion.button
            onClick={handleSubmit}   // ✅ Fix 2: onClick was missing entirely
            disabled={loading}
            whileHover={!loading ? { scale: 1.02, boxShadow: "0 12px 36px rgba(59,130,246,0.35)" } : {}}
            whileTap={!loading ? { scale: 0.97 } : {}}
            style={{
              width: "100%",
              padding: "13px 0",
              border: "none",
              borderRadius: 12,
              background: loading
                ? "rgba(59,130,246,0.4)"
                : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Epilogue', sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: loading ? 0.7 : 1,
              transition: "background 0.2s, opacity 0.2s",
            }}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <Spinner /> Generating notes…
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  ✨ Generate notes
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Credits hint */}
          <motion.p
            {...fadeUp(0.42)}
            style={{ textAlign: "center", fontSize: 11, color: MUTED, marginTop: 10 }}
          >
            <span style={{ color: ACCENT }}>●</span>{"  "}10 credits per generation
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ── Sub-components ──

function Label({ children }) {
  return (
    <label style={{
      display: "block", fontSize: 11, fontWeight: 600,
      color: "rgba(240,246,255,0.5)",
      textTransform: "uppercase", letterSpacing: "0.08em",
      marginBottom: 6, fontFamily: "'Epilogue', sans-serif",
    }}>
      {children}
    </label>
  )
}

function TextInput({ value, onChange, placeholder, autoFocus }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      value={value}
      autoFocus={autoFocus}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        padding: "10px 14px",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${focused ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: 10,
        color: "#f0f6ff",
        fontSize: 13,
        fontFamily: "'Epilogue', sans-serif",
        outline: "none",
        transition: "border-color 0.18s, box-shadow 0.18s",
        boxShadow: focused ? "0 0 0 3px rgba(59,130,246,0.13)" : "none",
      }}
    />
  )
}

function Toggle({ icon, label, sub, checked, onChange, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.22,1,0.36,1], delay }}
      onClick={onChange}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "11px 14px",
        borderRadius: 12,
        border: `1px solid ${checked ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.07)"}`,
        background: checked ? "rgba(59,130,246,0.08)" : "rgba(255,255,255,0.03)",
        cursor: "pointer",
        transition: "all 0.2s",
        userSelect: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, fontSize: 15,
          background: "rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {icon}
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#f0f6ff", fontFamily: "'Epilogue', sans-serif" }}>
            {label}
          </p>
          <p style={{ fontSize: 11, color: "rgba(240,246,255,0.4)", marginTop: 2 }}>{sub}</p>
        </div>
      </div>

      {/* Track */}
      <div style={{
        width: 36, height: 20, borderRadius: 10, flexShrink: 0,
        background: checked ? "#3b82f6" : "rgba(255,255,255,0.12)",
        position: "relative", transition: "background 0.2s",
      }}>
        <motion.div
          animate={{ left: checked ? 18 : 2 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          style={{
            width: 16, height: 16, borderRadius: "50%",
            background: "#fff", position: "absolute", top: 2,
            boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
          }}
        />
      </div>
    </motion.div>
  )
}

function Spinner() {
  return (
    <motion.svg
      width="16" height="16" viewBox="0 0 24 24"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
    >
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="3" fill="none" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
    </motion.svg>
  )
}