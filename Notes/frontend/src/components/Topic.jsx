import React, { useState } from 'react'
import { motion, AnimatePresence } from "motion/react"

const ease = [0.22, 1, 0.36, 1]

const ACCENT  = "#3b82f6"
const ACCENT2 = "#60a5fa"
const TEXT    = "#f0f6ff"
const MUTED   = "rgba(240,246,255,0.45)"
const BORDER  = "rgba(255,255,255,0.07)"

const EXAM_TYPES = ["CBSE", "ICSE", "JEE", "NEET", "O-Level", "A-Level", "SAT", "Custom"]
const CLASS_LEVELS = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "University"]

const Topic = ({ setResult, setLoading, loading, setError }) => {
  const [topic, setTopic]               = useState("")
  const [classLevel, setClassLevel]     = useState("")
  const [examType, setExamType]         = useState("")
  const [revisionMode, setRevisionMode] = useState(false)
  const [includeDiagram, setIncludeDiagram] = useState(false)
  const [includeChart, setIncludeChart] = useState(false)
  const [focused, setFocused]           = useState("")

  const canGenerate = topic.trim().length >= 3

  const handleGenerate = async () => {
    if (!canGenerate || loading) return
    setLoading(true)
    setError("")
    try {
      // your API call here
      await new Promise(r => setTimeout(r, 2000)) // placeholder
      setResult({ topic, classLevel, examType, revisionMode, includeDiagram, includeChart })
    } catch (e) {
      setError("Failed to generate notes. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      style={{ maxWidth: 620, margin: "0 auto", padding: "0 20px 60px" }}
    >

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(59,130,246,0.12)",
            border: "1px solid rgba(59,130,246,0.25)",
            borderRadius: 99, padding: "5px 14px 5px 8px", marginBottom: 16,
          }}
        >
          <span>✏️</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: ACCENT2, fontFamily: "'Lora', serif" }}>
            Note Generator
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            fontFamily: "'Lora', serif", fontSize: "clamp(22px, 5vw, 30px)",
            fontWeight: 700, color: TEXT, letterSpacing: "-0.02em", marginBottom: 8,
          }}
        >
          What are you studying?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ fontSize: 14, color: MUTED, fontFamily: "'Lora', serif" }}
        >
          Fill in the details and AI will generate structured notes for you.
        </motion.p>
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease }}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${BORDER}`,
          borderRadius: 22, padding: "28px 28px 24px",
          boxShadow: "0 8px 48px rgba(0,0,0,0.3)",
        }}
      >

        {/* Topic input */}
        <div style={{ marginBottom: 20 }}>
          <Label text="Topic or Chapter" />
          <InputField
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="e.g. Photosynthesis, Newton's Laws, French Revolution..."
            focused={focused === "topic"}
            onFocus={() => setFocused("topic")}
            onBlur={() => setFocused("")}
            maxLength={120}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 11, color: MUTED }}>{topic.length}/120</span>
            {topic.length > 0 && (
              <button onClick={() => setTopic("")}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: MUTED }}>
                clear ✕
              </button>
            )}
          </div>
        </div>

        {/* Class + Exam row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
          <div>
            <Label text="Class / Level" />
            <SelectChips
              options={CLASS_LEVELS}
              selected={classLevel}
              onSelect={setClassLevel}
              placeholder="Select class..."
            />
          </div>
          <div>
            <Label text="Exam Type" />
            <SelectChips
              options={EXAM_TYPES}
              selected={examType}
              onSelect={setExamType}
              placeholder="Select exam..."
            />
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${BORDER}`, marginBottom: 20 }} />

        {/* Toggles */}
        <div style={{ marginBottom: 24 }}>
          <Label text="Options" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Toggle
              label="Exam Revision Mode"
              desc="Bullet-point format optimized for quick revision"
              icon="📝"
              checked={revisionMode}
              onChange={() => setRevisionMode(!revisionMode)}
            />
            <Toggle
              label="Include Diagrams"
              desc="Add labeled diagrams and visual aids"
              icon="📊"
              checked={includeDiagram}
              onChange={() => setIncludeDiagram(!includeDiagram)}
            />
            <Toggle
              label="Include Charts"
              desc="Add comparison tables and flow charts"
              icon="📈"
              checked={includeChart}
              onChange={() => setIncludeChart(!includeChart)}
            />
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${BORDER}`, marginBottom: 20 }} />

        {/* Summary row */}
        {(classLevel || examType || revisionMode || includeDiagram || includeChart) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            style={{
              display: "flex", flexWrap: "wrap", gap: 6,
              marginBottom: 16,
            }}
          >
            {classLevel && <Tag text={classLevel} icon="🎓" />}
            {examType && <Tag text={examType} icon="📋" />}
            {revisionMode && <Tag text="Revision Mode" icon="📝" />}
            {includeDiagram && <Tag text="Diagrams" icon="📊" />}
            {includeChart && <Tag text="Charts" icon="📈" />}
          </motion.div>
        )}

        {/* Generate button */}
        <motion.button
          onClick={handleGenerate}
          disabled={!canGenerate || loading}
          whileHover={canGenerate && !loading ? {
            scale: 1.015,
            boxShadow: "0 12px 36px rgba(59,130,246,0.4)",
          } : {}}
          whileTap={canGenerate && !loading ? { scale: 0.98 } : {}}
          style={{
            width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            background: !canGenerate
              ? "rgba(255,255,255,0.06)"
              : loading
              ? "rgba(59,130,246,0.4)"
              : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            color: !canGenerate ? MUTED : "#fff",
            border: `1px solid ${!canGenerate ? BORDER : "transparent"}`,
            borderRadius: 13, padding: "14px 24px",
            fontSize: 15, fontWeight: 600,
            cursor: !canGenerate || loading ? "not-allowed" : "pointer",
            fontFamily: "'Epilogue', sans-serif",
            transition: "all 0.2s",
            boxShadow: canGenerate && !loading ? "0 4px 20px rgba(59,130,246,0.35)" : "none",
          }}
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{
                  width: 16, height: 16, borderRadius: "50%",
                  border: "2.5px solid rgba(255,255,255,0.25)",
                  borderTopColor: "#fff",
                }}
              />
              Generating Notes…
            </>
          ) : !canGenerate ? (
            "Enter a topic to continue"
          ) : (
            <><span style={{ fontSize: 16 }}>✨</span> Generate Notes</>
          )}
        </motion.button>

        <p style={{
          textAlign: "center", fontSize: 11, color: MUTED,
          marginTop: 12, fontFamily: "'Lora', serif",
        }}>
          Credits deducted only on successful generation.
        </p>
      </motion.div>
    </motion.div>
  )
}

// ── Sub-components ──

function Label({ text }) {
  return (
    <p style={{
      fontSize: 11, fontWeight: 700, color: ACCENT2,
      textTransform: "uppercase", letterSpacing: "0.1em",
      fontFamily: "'Lora', serif", marginBottom: 10,
    }}>{text}</p>
  )
}

function InputField({ value, onChange, placeholder, focused, onFocus, onBlur, maxLength }) {
  return (
    <motion.div
      animate={{
        boxShadow: focused ? "0 0 0 3px rgba(59,130,246,0.2)" : "none",
        borderColor: focused ? "#3b82f6" : BORDER,
      }}
      style={{
        border: `1px solid ${BORDER}`, borderRadius: 12,
        background: "rgba(255,255,255,0.05)", overflow: "hidden",
      }}
    >
      <input
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        style={{
          width: "100%", border: "none", background: "transparent",
          padding: "12px 16px", fontSize: 14, color: TEXT,
          fontFamily: "'Lora', serif", outline: "none",
          boxSizing: "border-box",
        }}
      />
    </motion.div>
  )
}

function SelectChips({ options, selected, onSelect, placeholder }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: "relative" }}>
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.01 }}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: selected ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.05)",
          border: `1px solid ${selected ? "rgba(59,130,246,0.3)" : BORDER}`,
          borderRadius: 12, padding: "12px 14px",
          color: selected ? ACCENT2 : MUTED,
          fontSize: 13, fontFamily: "'Lora', serif",
          cursor: "pointer", textAlign: "left",
        }}
      >
        <span>{selected || placeholder}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} style={{ fontSize: 10, color: MUTED }}>▼</motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 4 }}
            exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}
            style={{
              position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50,
              background: "rgba(10,18,40,0.98)",
              border: `1px solid ${BORDER}`, borderRadius: 12,
              overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
            }}
          >
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => { onSelect(opt); setOpen(false) }}
                style={{
                  width: "100%", display: "block",
                  background: selected === opt ? "rgba(59,130,246,0.1)" : "transparent",
                  border: "none", borderBottom: `1px solid ${BORDER}`,
                  padding: "10px 14px", cursor: "pointer",
                  textAlign: "left", color: selected === opt ? ACCENT2 : MUTED,
                  fontSize: 13, fontFamily: "'Lora', serif",
                  transition: "background 0.12s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(59,130,246,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = selected === opt ? "rgba(59,130,246,0.1)" : "transparent"}
              >
                {selected === opt && <span style={{ marginRight: 8, color: ACCENT2 }}>✓</span>}
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Toggle({ label, desc, icon, checked, onChange }) {
  return (
    <motion.div
      onClick={onChange}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: checked ? "rgba(59,130,246,0.08)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${checked ? "rgba(59,130,246,0.25)" : BORDER}`,
        borderRadius: 12, padding: "12px 16px",
        cursor: "pointer", transition: "all 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: checked ? ACCENT2 : TEXT, fontFamily: "'Lora', serif", marginBottom: 2 }}>
            {label}
          </p>
          <p style={{ fontSize: 11, color: MUTED, fontFamily: "'Lora', serif" }}>{desc}</p>
        </div>
      </div>

      {/* Toggle pill */}
      <motion.div
        animate={{ background: checked ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.1)" }}
        style={{
          width: 40, height: 22, borderRadius: 99, flexShrink: 0,
          border: `1px solid ${checked ? "rgba(59,130,246,0.4)" : BORDER}`,
          position: "relative", transition: "border-color 0.2s",
        }}
      >
        <motion.div
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          style={{
            position: "absolute", top: 2,
            width: 16, height: 16, borderRadius: "50%",
            background: checked ? ACCENT2 : "rgba(255,255,255,0.35)",
          }}
        />
      </motion.div>
    </motion.div>
  )
}

function Tag({ text, icon }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: "rgba(59,130,246,0.1)",
      border: "1px solid rgba(59,130,246,0.2)",
      borderRadius: 99, padding: "4px 10px",
      fontSize: 11, color: ACCENT2, fontFamily: "'Lora', serif",
    }}>
      <span>{icon}</span> {text}
    </div>
  )
}

export default Topic