import { useState } from 'react'
import axios from 'axios'
import { ChatWindow } from './components/ChatWindow'
import { ChatInput } from './components/ChatInput'
import { JsonViewer } from './components/JsonViewer'
import { WireframePreview } from './components/WireframePreview'
import initialLayout from './data/initialLayout.json'

const API_URL = 'http://localhost:3001/api/chat'

export default function App() {
  const [layout, setLayout] = useState(initialLayout)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  async function sendMessage(userText) {
    // Add user message to chat
    const newMessages = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const { data } = await axios.post(API_URL, {
        message: userText,
        layout: layout,
        history: messages, // send full history for context
      })

      // Update layout if we got a valid one back
      if (data.updatedLayout) {
        setLayout(data.updatedLayout)
      }

      // Add assistant reply to chat
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.assistantMessage || 'Done!' }
      ])
    } catch (err) {
      console.error('Request failed:', err)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Is the server running?' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  function resetLayout() {
    setLayout(initialLayout)
    setMessages([])
  }

  const artboard = layout.nodes[layout.rootNodes[0]]

  return (
    <div className="flex h-screen bg-gray-100 font-sans">

      {/* LEFT PANEL — Chat */}
      <div className="w-[420px] flex flex-col bg-white border-r border-gray-200 shadow-sm">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-gray-900">Layout Agent</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Canvas: {artboard?.width ?? '?'} × {artboard?.height ?? '?'}px
            </p>
          </div>
          <button
            onClick={resetLayout}
            className="text-xs text-gray-500 hover:text-red-500 border border-gray-200
                       hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Chat messages */}
        <ChatWindow messages={messages} isLoading={isLoading} />

        {/* Input */}
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>

      {/* RIGHT PANEL — Preview + JSON */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top: Wireframe */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <WireframePreview layout={layout} />
        </div>

        {/* Bottom: JSON viewer */}
        <div className="flex-1 p-6 overflow-hidden">
          <JsonViewer layout={layout} />
        </div>
      </div>
    </div>
  )
}