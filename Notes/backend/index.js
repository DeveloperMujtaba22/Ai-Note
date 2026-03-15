import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./utils/connectDB.js"
import authRoutes from "./routes/authRoutes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,           // allow cookies
}))
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)

app.get("/", (req, res) => res.json({ message: "ExamNote AI backend running 🎆" }))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  connectDB()
})