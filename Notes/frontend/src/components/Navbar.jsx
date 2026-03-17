import React, { useState, useEffect } from 'react'
import logo from "../assets/logo.png"
import { motion, AnimatePresence } from "motion/react"
import { useSelector } from 'react-redux'

const links = ["Features", "Pricing", "About"]

const Navbar = () => {
  const { userData } = useSelector((state) => state.user)
  const credits = userData?.credits ?? 0
  const [showCredits, setShowCredits] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed", top: 16, left: "50%", x: "-50%",
          zIndex: 100, width: "90%", maxWidth: 1000,
          background: "#374151",
          border: scrolled
            ? "1px solid rgba(176,125,58,0.35)"
            : "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "11px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          transition: "border-color 0.4s",
        }}
      >
        {/* Logo */}
        <motion.div
          style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <motion.img
            src={logo}
            alt="ExamNote AI"
            className="w-10 h-10"
            style={{ borderRadius: 8 }}
            whileHover={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 0.4 }}
          />
          <span style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 20, color: "#f5f1eb" }}>
            ExamNote <span style={{ color: "#b07d3a" }}>AI</span>
          </span>
        </motion.div>

        {/* Nav links */}
        <div style={{ display: "flex", gap: 28 }}>
          {links.map((item, i) => (
            <NavLink key={item} label={item} delay={0.1 + i * 0.07} />
          ))}
        </div>

        {/* Right side — credits + button */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

          {/* Credits pill + dropdown */}
          <div style={{ position: "relative" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowCredits(!showCredits)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(176,125,58,0.15)",
                border: "1px solid rgba(176,125,58,0.35)",
                borderRadius: 99,
                padding: "5px 12px",
                cursor: "pointer",
              }}
            >
              {/* Coin SVG */}
              <motion.svg
                width="16" height="16" viewBox="0 0 16 16"
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
              >
                <circle cx="8" cy="8" r="7" fill="#b07d3a" />
                <circle cx="8" cy="8" r="5.5" fill="none" stroke="#d4a85a" strokeWidth="1" />
                <text x="8" y="11.5" textAnchor="middle" fontSize="7" fontWeight="700" fill="#f5e6c8">$</text>
              </motion.svg>

              <span style={{ fontSize: 13, fontWeight: 600, color: "#d4a85a" }}>
                {credits}
              </span>
              <span style={{ fontSize: 12, color: "rgba(212,168,90,0.6)", fontWeight: 400 }}>
                credits
              </span>
            </motion.div>

            {/* Dropdown */}
            <AnimatePresence>
              {showCredits && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 10, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-4 w-64 rounded-2xl border border-white/10 p-4 text-white"
                  style={{
                    background: "rgba(0,0,0,0.90)",
                    backdropFilter: "blur(24px)",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
                    zIndex: 200,
                  }}
                >
                  <h4 className="font-semibold mb-2" style={{ fontSize: 15 }}>
                    Buy Credits
                  </h4>
                  <p className="text-sm text-gray-300 mb-4">
                    Use credits to generate AI notes, diagrams & PDFs.
                  </p>

                  {/* Credit balance bar */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Balance</span>
                      <span style={{ fontSize: 12, color: "#d4a85a", fontWeight: 600 }}>{credits} left</span>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 6 }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((credits / 50) * 100, 100)}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        style={{ background: "#b07d3a", borderRadius: 99, height: "100%" }}
                      />
                    </div>
                  </div>

                  <button
                    className="w-full py-2 rounded-lg font-semibold hover:opacity-90"
                    style={{
                      background: "linear-gradient(to right, #d4a85a, #b07d3a)",
                      color: "#1a1714",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                  >
                    Buy More Credits
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
            whileHover={{ scale: 1.06, background: "#c4903f" }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: "#b07d3a", color: "#fff",
              border: "none", borderRadius: 10,
              padding: "8px 20px", fontSize: 14, fontWeight: 500,
              cursor: "pointer", transition: "background 0.2s",
            }}
          >
            Get Started
          </motion.button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", top: 0, left: "50%", x: "-50%",
              width: 400, height: 80, zIndex: 99,
              background: "radial-gradient(ellipse, rgba(176,125,58,0.15) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function NavLink({ label, delay }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.a
      href="#"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: 14, fontWeight: 500,
        color: hovered ? "#b07d3a" : "#f9fafb",
        textDecoration: "none",
        transition: "color 0.2s",
        position: "relative",
      }}
    >
      {label}
      <motion.span style={{
        position: "absolute", bottom: -2, left: 0,
        height: 1, background: "#b07d3a",
        width: hovered ? "100%" : "0%",
        transition: "width 0.2s ease",
        display: "block",
      }} />
    </motion.a>
  )
}

export default Navbar