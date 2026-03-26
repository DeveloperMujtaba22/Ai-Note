import User from "../models/user.js";
import Notes from "../models/notes.js";
import { generateGeminiResponse } from "../services/gemini.js"; // ← added .js
import { buildPrompt } from "../utils/promptBuilder.js";

export const generateNotes = async (req, res) => {
  try {
    const {
      topic,
      classLevel,
      examType,
      revisionMode = false,
      includeDiagram = false,
      includeChart = false,
    } = req.body; // ← was req.body() — body is not a function

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.credits < 10) {
      user.isCreditAvailable = false;
      await user.save();
      return res.status(403).json({ message: "Insufficient credits" });
    }

    const prompt = buildPrompt({
      topic, classLevel, examType,
      revisionMode, includeDiagram, includeChart,
    });

    const aiResponse = await generateGeminiResponse(prompt); // ← was missing await

    const note = await Notes.create({ // ← renamed to `note` (singular) for consistency
      user: user._id,
      topic, classLevel, examType,
      revisionMode, includeDiagram, includeChart,
      content: aiResponse,
    });

    user.credits -= 10;
    if (user.credits <= 0) user.isCreditAvailable = false;

    if (!Array.isArray(user.notes)) user.notes = [];
    user.notes.push(note._id); // ← was `notes._id` (wrong variable name)

    await user.save();

    return res.status(200).json({
      data: aiResponse,
      noteId: note._id,
      creditLeft: user.credits,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI generation failed", message: error.message });
  }
};