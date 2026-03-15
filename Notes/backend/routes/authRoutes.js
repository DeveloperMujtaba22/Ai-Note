import express from "express"
import { googleAuth, logOut } from "../controllers/authController.js"

const router = express.Router()

router.post("/google", googleAuth)
router.get("/logout", logOut)

export default router