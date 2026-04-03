const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const generateGeminiResponse = async (prompt) => {
  const MAX_RETRIES = 3
  const RETRY_DELAY_MS = 20000 // 20 seconds between retries

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Gemini attempt ${attempt}/${MAX_RETRIES}`)

      const response = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
          },
        }),
      })

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        const status = response.status

     if (status === 429) {
  const errMsg = JSON.stringify(errBody).toLowerCase()
  const isDailyQuota = errMsg.includes("daily") || errMsg.includes("quota exceeded")

  if (isDailyQuota) {
    // No point retrying — daily limit is hit
    throw new Error("QUOTA_EXCEEDED")
  }

  if (attempt < MAX_RETRIES) {
    console.warn(`Rate limit hit — waiting 20s before retry ${attempt + 1}`)
    await sleep(20000)
    continue
  }

  throw new Error("QUOTA_EXCEEDED")
}
        throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errBody)}`)
      }

      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!text) throw new Error("No text returned from Gemini")

      // Extract JSON from the response
      const firstBrace = text.indexOf("{")
      const lastBrace = text.lastIndexOf("}")

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
      // If it's not a quota error, don't retry
      if (error.message !== "QUOTA_EXCEEDED") {
        console.error("Gemini Error:", error.message)
        throw error
      }

      // If we've exhausted retries on quota error, rethrow
      if (attempt === MAX_RETRIES) {
        console.error("Gemini Error: QUOTA_EXCEEDED after all retries")
        throw error
      }
    }
  }
}