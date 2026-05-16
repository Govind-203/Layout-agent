const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { GoogleGenerativeAI } = require('@google/generative-ai')
const { buildSystemPrompt } = require('./promptBuilder')
const { parseAndValidate } = require('./validator')

const app = express()
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.post('/api/chat', async (req, res) => {
  const { message, layout, history = [] } = req.body

  if (!message || !layout) {
    return res.status(400).json({ error: 'message and layout are required' })
  }

  try {
    const systemPrompt = buildSystemPrompt(layout)

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      systemInstruction: systemPrompt,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    })

    const geminiHistory = history.slice(-6).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    const chat = model.startChat({ history: geminiHistory })

    const wrappedMessage = `${message}

CRITICAL: Your entire response must be ONLY this JSON object, nothing else:
{"updatedLayout": { ...complete layout JSON... }, "assistantMessage": "short description of what changed"}`

    const result = await chat.sendMessage(wrappedMessage)
    const rawText = result.response.text()

    const parsed = parseAndValidate(rawText)
    res.json(parsed)

  } catch (err) {
    console.error('Gemini error:', err.message)
    res.status(500).json({
      updatedLayout: null,
      assistantMessage: 'Server error. Please check your Gemini API key and try again.'
    })
  }
})

app.get('/api/health', (req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))