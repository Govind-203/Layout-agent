import { useEffect, useRef } from 'react'

export function ChatWindow({ messages, isLoading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
      {messages.length === 0 && (
        <div className="text-center text-gray-400 text-sm mt-8">
          <p className="font-medium mb-2">Try these prompts:</p>
          <p>"Convert this design to 9:16"</p>
          <p>"Move the headline to the top"</p>
          <p>"Make the headline smaller"</p>
          <p>"Make the badge bigger"</p>
          <p>"Change headline color to red"</p>
        </div>
      )}

      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'
            }`}
          >
            {msg.content}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-2 shadow-sm">
            <div className="flex gap-1 items-center h-5">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}