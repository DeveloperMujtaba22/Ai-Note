import React, { useState, useEffect, useRef } from 'react'
import logo from "../assets/logo.png"
import { motion, AnimatePresence } from "motion/react"
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import { setUserData } from '../react-redux/userSlice'

const links = ["Features", "Pricing", "About"]

const Navbar = () => {
  const { userData } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const credits = userData?.credits ?? 0
  const [showCredits, setShowCredits] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  const profileRef = useRef(null)
  const creditsRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("scroll", onScroll)
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false)
      if (creditsRef.current && !creditsRef.current.contains(e.target)) setShowCredits(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const handleLogout = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
      localStorage.removeItem("token")
      dispatch(setUserData(null))
      navigate("/auth")
    } catch (err) {
      console.error(err)
    }
  }

  const avatarSrc = userData?.photo || userData?.photoURL || userData?.avatar
  const initials = userData?.name?.charAt(0).toUpperCase() ?? "U"

  const menuItems = [
    { icon: "📄", label: "My Notes", action: () => navigate("/") },
    { icon: "🕓", label: "History",  action: () => navigate("/history") },
    { icon: "⚙️", label: "Settings", action: () => navigate("/settings") },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed", top: 16, left: "50%", x: "-50%",
          zIndex: 100, width: "90%", maxWidth: 1200,
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
          onClick={() => navigate("/")}
        >
          <motion.img
            src={logo}
            alt="ExamNote AI"
            style={{ width: 40, height: 40, borderRadius: 8 }}
            whileHover={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 0.4 }}
          />
          <span style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 20, color: "#f5f1eb" }}>
            ExamNote <span style={{ color: "#b07d3a" }}>AI</span>
          </span>
        </motion.div>

        {/* ── DESKTOP ── */}
        {!isMobile && (
          <>
            <div style={{ display: "flex", gap: 28 }}>
              {links.map((item, i) => (
                <NavLink key={item} label={item} delay={0.1 + i * 0.07} />
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

              {/* Credits pill */}
              <div style={{ position: "relative" }} ref={creditsRef}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => { setShowCredits(!showCredits); setShowProfile(false) }}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "rgba(176,125,58,0.15)",
                    border: "1px solid rgba(176,125,58,0.35)",
                    borderRadius: 99, padding: "5px 12px",
                    cursor: "pointer",
                  }}
                >
                  <CoinSVG />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#d4a85a" }}>{credits}</span>
                  <span style={{ fontSize: 12, color: "rgba(212,168,90,0.6)" }}>credits</span>
                </motion.div>

                <AnimatePresence>
                  {showCredits && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 10, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: "absolute", right: 0, top: "100%",
                        width: 256, borderRadius: 16,
                        border: "1px solid rgba(255,255,255,0.1)",
                        padding: 16, color: "#fff",
                        background: "rgba(0,0,0,0.90)",
                        backdropFilter: "blur(24px)",
                        boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
                        zIndex: 200,
                      }}
                    >
                      {/* ✅ onBuy prop passed correctly */}
                      <CreditsDropdownContent
                        credits={credits}
                        onBuy={() => { setShowCredits(false); navigate("/pricing") }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile */}
              <div style={{ position: "relative" }} ref={profileRef}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 }}
                  onClick={() => { setShowProfile(!showProfile); setShowCredits(false) }}
                  style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
                >
                  <Avatar src={avatarSrc} initials={initials} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#f5f1eb" }}>
                    {userData?.name ?? "User"}
                  </span>
                  <motion.span
                    animate={{ rotate: showProfile ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ fontSize: 10, color: "rgba(245,241,235,0.4)", marginLeft: 2 }}
                  >▼</motion.span>
                </motion.div>

                <AnimatePresence>
                  {showProfile && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 10, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: "absolute", right: 0, top: "100%",
                        width: 210,
                        background: "rgba(0,0,0,0.90)",
                        backdropFilter: "blur(24px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 14, padding: 8,
                        boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
                        zIndex: 200,
                      }}
                    >
                      <div style={{
                        padding: "8px 12px 10px",
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                        marginBottom: 4,
                      }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#f5f1eb", margin: 0 }}>
                          {userData?.name ?? "User"}
                        </p>
                      </div>

                      {menuItems.map(({ icon, label, action }) => (
                        <ProfileMenuItem
                          key={label} icon={icon} label={label}
                          onClick={() => { action(); setShowProfile(false) }}
                        />
                      ))}

                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", margin: "4px 0" }} />
                      <ProfileMenuItem icon="🚪" label="Log out" onClick={handleLogout} danger />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </>
        )}

        {/* ── MOBILE — Hamburger ── */}
        {isMobile && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(true)}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 10, padding: "7px 10px",
              cursor: "pointer", display: "flex", flexDirection: "column",
              gap: 4, alignItems: "center", justifyContent: "center",
            }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: "block", width: 20, height: 2,
                background: "#f5f1eb", borderRadius: 2,
              }} />
            ))}
          </motion.button>
        )}
      </motion.nav>

      {/* ── MOBILE BOTTOM SHEET ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: "fixed", inset: 0, zIndex: 200,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
              }}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              style={{
                position: "fixed", bottom: 0, left: 0, right: 0,
                zIndex: 201,
                background: "#1f2937",
                border: "1px solid rgba(176,125,58,0.25)",
                borderTopLeftRadius: 24, borderTopRightRadius: 24,
                padding: "0 0 40px",
                boxShadow: "0 -20px 60px rgba(0,0,0,0.6)",
              }}
            >
              {/* Drag handle */}
              <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 8px" }}>
                <div style={{ width: 40, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.15)" }} />
              </div>

              {/* Profile header */}
              <div style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "12px 24px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                marginBottom: 8,
              }}>
                <Avatar src={avatarSrc} initials={initials} size={48} />
                <div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#f5f1eb", margin: 0 }}>
                    {userData?.name ?? "User"}
                  </p>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    marginTop: 4,
                    background: "rgba(176,125,58,0.15)",
                    border: "1px solid rgba(176,125,58,0.3)",
                    borderRadius: 99, padding: "3px 10px",
                  }}>
                    <CoinSVG size={13} />
                    <span style={{ fontSize: 12, color: "#d4a85a", fontWeight: 600 }}>{credits} credits</span>
                  </div>
                </div>
              </div>

              {/* Nav links */}
              <div style={{ padding: "0 16px", marginBottom: 8 }}>
                {links.map((label, i) => (
                  <motion.button
                    key={label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center",
                      background: "transparent", border: "none",
                      padding: "13px 12px", borderRadius: 12,
                      color: "#f5f1eb", fontSize: 15, fontWeight: 500,
                      cursor: "pointer", textAlign: "left",
                    }}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", margin: "4px 16px 8px" }} />

              {/* App menu items */}
              <div style={{ padding: "0 16px" }}>
                {menuItems.map(({ icon, label, action }, i) => (
                  <motion.button
                    key={label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                    onClick={() => { action(); setMobileOpen(false) }}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 14,
                      background: "transparent", border: "none",
                      padding: "13px 12px", borderRadius: 12,
                      color: "rgba(255,255,255,0.75)", fontSize: 15,
                      cursor: "pointer", textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{icon}</span>
                    {label}
                  </motion.button>
                ))}

                {/* ✅ Buy Credits — onClick fixed */}
                <motion.button
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => { navigate("/pricing"); setMobileOpen(false) }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 14,
                    background: "rgba(176,125,58,0.1)",
                    border: "1px solid rgba(176,125,58,0.2)",
                    padding: "13px 12px", borderRadius: 12,
                    color: "#d4a85a", fontSize: 15, fontWeight: 600,
                    cursor: "pointer", textAlign: "left", marginTop: 4,
                  }}
                >
                  <span style={{ fontSize: 18 }}>🪙</span>
                  Buy More Credits
                </motion.button>
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", margin: "12px 16px 8px" }} />

              {/* Logout */}
              <div style={{ padding: "0 16px" }}>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  onClick={handleLogout}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 14,
                    background: "rgba(248,113,113,0.08)",
                    border: "1px solid rgba(248,113,113,0.15)",
                    padding: "13px 12px", borderRadius: 12,
                    color: "#f87171", fontSize: 15, fontWeight: 500,
                    cursor: "pointer", textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 18 }}>🚪</span>
                  Log out
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Scroll glow */}
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

// ── Shared sub-components ──

function Avatar({ src, initials, size = 36 }) {
  const [imgError, setImgError] = useState(false)
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "rgba(176,125,58,0.2)",
      border: `${size > 40 ? 2 : 1.5}px solid rgba(176,125,58,0.5)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 600, color: "#d4a85a",
      overflow: "hidden", flexShrink: 0,
    }}>
      {src && !imgError
        ? <img src={src} alt="avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={() => setImgError(true)}
          />
        : initials
      }
    </div>
  )
}

function CoinSVG({ size = 16 }) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 16 16"
      animate={{ rotateY: [0, 360] }}
      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
    >
      <circle cx="8" cy="8" r="7" fill="#b07d3a" />
      <circle cx="8" cy="8" r="5.5" fill="none" stroke="#d4a85a" strokeWidth="1" />
      <text x="8" y="11.5" textAnchor="middle" fontSize="7" fontWeight="700" fill="#f5e6c8">$</text>
    </motion.svg>
  )
}

// ✅ Accepts onBuy prop — no more scope error
function CreditsDropdownContent({ credits, onBuy }) {
  return (
    <>
      <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Buy Credits</h4>
      <p style={{ fontSize: 13, color: "#d1d5db", marginBottom: 16 }}>
        Use credits to generate AI notes, diagrams & PDFs.
      </p>
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
        onClick={onBuy}
        style={{
          width: "100%", padding: "8px 0", borderRadius: 8,
          background: "linear-gradient(to right, #d4a85a, #b07d3a)",
          color: "#1a1714", border: "none", cursor: "pointer",
          fontSize: 14, fontWeight: 600,
        }}
      >
        Buy More Credits
      </button>
    </>
  )
}

function ProfileMenuItem({ icon, label, onClick, danger }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        background: hovered
          ? danger ? "rgba(248,113,113,0.08)" : "rgba(255,255,255,0.07)"
          : "transparent",
        border: "none", padding: "9px 12px", borderRadius: 9,
        color: danger ? "#f87171" : "rgba(255,255,255,0.75)",
        fontSize: 13, cursor: "pointer", textAlign: "left",
        transition: "background 0.15s",
      }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      {label}
    </button>
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
        textDecoration: "none", transition: "color 0.2s",
        position: "relative",
      }}
    >
      {label}
      <motion.span style={{
        position: "absolute", bottom: -2, left: 0,
        height: 1, background: "#b07d3a",
        width: hovered ? "100%" : "0%",
        transition: "width 0.2s ease", display: "block",
      }} />
    </motion.a>
  )
}

export default Navbar