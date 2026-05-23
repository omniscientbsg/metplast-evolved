"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { MessageCircle, X, Send } from "lucide-react"

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat()

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-dark border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="p-4 bg-primary text-white font-bold flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Metplast Assistant
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-black/20 p-1 rounded-md transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-white/50 mt-10">
                <p>Hello! How can I help you with our poultry equipment today?</p>
              </div>
            )}
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-xl px-4 py-2 ${m.role === 'user' ? 'bg-primary text-white' : 'bg-white/10 text-white/90'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-white/90 rounded-xl px-4 py-2 animate-pulse">
                  Typing...
                </div>
              </div>
            )}
            {error && (
              <div className="flex justify-center">
                <div className="bg-red-500/20 text-red-400 rounded-xl px-4 py-2 text-sm text-center">
                  Error: Could not connect to AI.
                </div>
              </div>
            )}
          </div>

          <form 
            onSubmit={handleSubmit} 
            className="p-3 border-t border-white/10 bg-black/20 flex gap-2"
          >
            <input
              name="prompt"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask a question..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
              autoComplete="off"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input?.trim()}
              className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white p-2 rounded-xl transition-colors flex items-center justify-center w-11"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}
