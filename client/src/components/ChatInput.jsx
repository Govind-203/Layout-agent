import { useState } from 'react'

export function ChatInput({ onSend, isLoading }) {
  const [text, setText] = useState('')

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setText('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="e.g. Convert to 9:16, Move headline to top..."
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !text.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  )
}