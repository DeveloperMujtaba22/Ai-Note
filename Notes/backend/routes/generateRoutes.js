import express from "express"
import isAuth from "../middleware/isAuth.js"
import { generateNotes } from "../controllers/generateController.js"


const notesRoutes = express.Router()

notesRoutes.post("/generate-notes",isAuth,generateNotes)

export default notesRoutes