import admin from "../utils/firebaseAdmin.js"
import jwt from "jsonwebtoken"
import User from "../models/user.js"

export const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body
    if (!idToken) return res.status(400).json({ message: "ID token required" })

    // 1. Verify Firebase ID token
    const decoded = await admin.auth().verifyIdToken(idToken)
    const { uid, name, email, picture } = decoded

    // 2. Upsert user in MongoDB
    let user = await User.findOne({ email })
    if (!user) {
      user = await User.create({
        name: name || "User",
        email,
        firebaseUid: uid,
        avatar: picture,
        credits: 50,
        isCreditAvailable: true,
        notes: [],
      })
    }

    // 3. Issue your own JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    // 4. Also set as httpOnly cookie for security
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
        avatar: picture,
      },
    })
  } catch (err) {
    console.error("Google auth error:", err.message)
    res.status(401).json({ message: "Authentication failed" })
  }
}