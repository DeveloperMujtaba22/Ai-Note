export const buildPrompt = ({
  topic,
  classLevel,
  examType,
  revisionMode,
  includeDiagram,
  includeChart
}) => {
  return `
You are a STRICT JSON generator for an exam preparation system.

⚠ VERY IMPORTANT:
- Output MUST be valid JSON
- Your response will be parsed using JSON.parse()
- INVALID JSON will cause system failure
- Use ONLY double quotes "
- NO comments, NO trailing commas
- Escape line breaks using \\n
- Do NOT use emojis inside text values

TASK:
Convert the given topic into exam-focused notes.

INPUT:
Topic: ${topic}
Class Level: ${classLevel || "Not specified"}
Exam Type: ${examType || "General"}
Revision Mode: ${revisionMode ? "ON" : "OFF"}
Include Diagram: ${includeDiagram ? "YES" : "NO"}
Include Charts: ${includeChart ? "YES" : "NO"}

GLOBAL CONTENT RULES:
- Use clear, simple, exam-oriented language
- Notes MUST be Markdown formatted
- Headings and bullet points only

REVISION MODE RULES (CRITICAL):
- If REVISION MODE is ON:
  - Notes must be VERY SHORT
  - Only bullet points
  - One-line answers only
  - Definitions, formulas, keywords
  - No paragraphs
  - No explanations
  - Content must feel like:
    - last-day revision
    - 5-minute exam cheat sheet
  - revisionPoints MUST summarize ALL important facts

- If REVISION MODE is OFF:
  - Notes must be DETAILED but exam-focused
  - Each topic should include:
    - definition
    - short explanation
    - examples (if applicable)
  - Paragraph length: max 2-4 lines
  - No storytelling, no extra theory

IMPORTANCE RULES:
- Divide sub-topics into THREE categories:
  - ★ Very Important Topics
  - ★★ Important Topics
  - ★★★ Frequently Asked Topics
- All three categories MUST be present
- Base importance on exam frequency and weightage

DIAGRAM RULES:
- If Include Diagram is YES:
  - Generate a diagram description in the "diagram" field
  - type must be one of: "flowchart" | "graph" | "process"
  - data must be a string describing the diagram structure
- If Include Diagram is NO:
  - Set diagram.type to "" and diagram.data to ""

CHART RULES:
- If Include Charts is YES:
  - Populate the "charts" array with comparison data
  - Format: { "title": "string", "data": [{ "name": "string", "value": 10 }] }
- If Include Charts is NO:
  - Return charts as empty array []

QUESTIONS RULES:
- Generate exam-style questions based on the topic
- short: 2-3 short answer questions (1-2 lines)
- long: 2 long answer / essay questions
- diagram: one diagram-based question (empty string if no diagram)

STRICT JSON FORMAT (DO NOT CHANGE):

{
  "title": "string",
  "subTopics": {
    "★": [],
    "★★": [],
    "★★★": []
  },
  "importance": "★ | ★★ | ★★★",
  "notes": "string",
  "revisionPoints": [],
  "questions": {
    "short": [],
    "long": [],
    "diagram": ""
  },
  "diagram": {
    "type": "flowchart | graph | process",
    "data": ""
  },
  "charts": []
}

Return ONLY the JSON object. No explanation. No markdown code block. No extra text.
`
}