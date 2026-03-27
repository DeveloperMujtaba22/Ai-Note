import React, { useState } from "react"
import { motion } from "motion/react"
import { useSelector } from "react-redux"
import logo from "../assets/logo.png"
import { useNavigate } from "react-router-dom"
import Topic from "../components/Topic"

const Notes = () => {
  const { userData } = useSelector((state) => state.user)
  const credits = userData?.credits ?? 0
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [result,setResult] = useState(null)
  const [error,setError] = useState("") 

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a" }}>

      {/* Navbar */}
      <div style={{
        position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
        zIndex: 100, width: "90%", maxWidth: 1200,
        background: "#374151",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16, padding: "11px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>

        {/* Logo — left */}
        <motion.div
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/")}
          style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}
        >
          <img src={logo} style={{ width: 40, height: 40, borderRadius: 8 }} />
          <span style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 20, color: "#f5f1eb" }}>
            ExamNote <span style={{ color: "#b07d3a" }}>AI</span>
          </span>
        </motion.div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

          {/* Your Notes button */}
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/history")}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 10, padding: "8px 14px",
              color: "#f5f1eb", fontSize: 13, fontWeight: 500,
              cursor: "pointer", fontFamily: "'Epilogue', sans-serif",
            }}
          >
            📚 Your Notes
          </motion.button>

          {/* Credits pill — clicks to /pricing */}
          <motion.div
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/pricing")}  
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(176,125,58,0.15)",
              border: "1px solid rgba(176,125,58,0.35)",
              borderRadius: 99, padding: "5px 12px", cursor: "pointer",
            }}
          >
            {/* ✅ Coin SVG — fixed */}
            <motion.svg
              width="16" height="16" viewBox="0 0 16 16"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
            >
              <circle cx="8" cy="8" r="7" fill="#b07d3a" />
              <circle cx="8" cy="8" r="5.5" fill="none" stroke="#d4a85a" strokeWidth="1" />
              <text x="8" y="11.5" textAnchor="middle" fontSize="7" fontWeight="700" fill="#f5e6c8">$</text>
            </motion.svg>

            <span style={{ fontSize: 13, fontWeight: 600, color: "#d4a85a" }}>{credits}</span>
            <span style={{ fontSize: 12, color: "rgba(212,168,90,0.6)" }}>credits</span>
          </motion.div>

        </div>
      </div>

      {/* Page content */}
      <div style={{ paddingTop: 100 }}>
        {/* your notes content here */}
      </div>

      <motion.div>
        <Topic loading={loading} setResult={setResult} setLoading={setLoading} setError={setError}/>
      </motion.div>
     { ! result && <motion.div>
        <span>📘</span>
        <p>Generate notes will appear here</p>
      </motion.div>}

      {error && (
  <motion.p
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      textAlign: "center", fontSize: 13,
      color: "#f87171", marginTop: 12,
      padding: "10px 16px",
      background: "rgba(248,113,113,0.08)",
      border: "1px solid rgba(248,113,113,0.2)",
      borderRadius: 10,
      maxWidth: 560, margin: "12px auto 0",
    }}
  >
    ⚠️ {error}
  </motion.p>
)}

    </div>
  )
}

export default Notes