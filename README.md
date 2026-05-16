# Layout Agent

A chat-based layout agent that lets you modify a design JSON using natural language.
Built as part of the Compra AI Engineer Intern assignment.

![Layout Agent Preview](https://res.cloudinary.com/dzydbgyfj/image/upload/v1778502510/Instagram_Post_1080x1080_19_iw9uqy.png)

## What it does

- Chat with an AI agent using plain English
- Agent understands design instructions like "Convert to 9:16", "Move headline to top", "Make badge bigger"
- Layout JSON updates automatically after every instruction
- Wireframe preview renders the layout visually with real images
- Follows up on context — "make it bigger" understands what "it" refers to

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Backend | Node.js + Express |
| LLM | Google Gemini 1.5 Flash (via @google/generative-ai) |
| State | React useState |
| Preview | Absolute-positioned divs scaled from normalized coords |

## Prerequisites

- Node.js v18 or newer
- A Gemini API key — get one free at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- Git

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/layout-agent.git
cd layout-agent
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Add your API key

Create a `.env` file inside `server/`:
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001

### 4. Install frontend dependencies

```bash
cd ../client
npm install
```

### 5. Run the app

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd server
node index.js
# Server running on http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# App running on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Example prompts to try
Convert this design to 9:16
Keep the product large
Move the headline to the top
Move the offer badge higher
Make the headline smaller
Make it bigger
Change the headline color to red
Make the discount badge bigger
Center the product horizontally
Convert to 16:9

## Project Structure
layout-agent/
├── README.md
├── APPROACH.md
├── server/
│   ├── index.js          ← Express server + /api/chat route
│   ├── promptBuilder.js  ← System prompt with transformation rules
│   ├── validator.js      ← Safe JSON parsing and validation
│   ├── .env              ← API key (never committed)
│   └── package.json
└── client/
├── vite.config.js
└── src/
├── App.jsx
├── data/
│   └── initialLayout.json
└── components/
├── ChatWindow.jsx
├── ChatInput.jsx
├── JsonViewer.jsx
└── WireframePreview.jsx

## How it works

1. User types an instruction in the chat input
2. Frontend sends `{ message, layout, history }` to `POST /api/chat`
3. Backend builds a detailed system prompt with the current layout JSON and transformation rules
4. Gemini returns a JSON object with `updatedLayout` and `assistantMessage`
5. Frontend validates the response, updates the layout state, and re-renders the wireframe

## Supported transformations

- **Aspect ratio conversion** — 1:1, 9:16, 16:9, 4:5
- **Element movement** — top, bottom, left, right, center, higher, lower
- **Text resizing** — smaller, bigger, much bigger
- **Element scaling** — make badge/product bigger or smaller
- **Color changes** — change text or shape color to any color
- **Follow-up context** — resolves "it", "that", "the same one" from conversation history
