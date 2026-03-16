import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./utils/connectDB.js"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods:["GET", "POST", "PUT", "DELETE" , "OPTIONS"]
}))
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)

app.get("/", (req, res) => res.json({ message: "ExamNote AI backend running 🎆" }))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  connectDB()
})

// Add after app.use(cors(...))
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups")
  next()
})