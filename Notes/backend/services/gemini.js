const Gemini_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

export const generateGeminiResponse = async (prompt) => {
  try {
    const response = await fetch(`${Gemini_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      if (response.status === 429) throw new Error("QUOTA_EXCEEDED")
      throw new Error(`Gemini error ${response.status}: ${JSON.stringify(err)}`)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) throw new Error("No text returned from Gemini")

    // More aggressive cleaning — strip everything before first { and after last }
    const firstBrace = text.indexOf("{")
    const lastBrace  = text.lastIndexOf("}")

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error(`Gemini did not return JSON. Response: ${text.slice(0, 200)}`)
    }

    const jsonString = text.slice(firstBrace, lastBrace + 1)

    try {
      return JSON.parse(jsonString)
    } catch (parseErr) {
      throw new Error(`JSON parse failed: ${parseErr.message}. Raw: ${jsonString.slice(0, 200)}`)
    }

  } catch (error) {
    console.error("Gemini Error:", error.message)
    throw error
  }
}