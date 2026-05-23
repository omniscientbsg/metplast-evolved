"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ChatbotAdminPage() {
  const [provider, setProvider] = useState("gemini")
  const [geminiKey, setGeminiKey] = useState("")
  const [openaiKey, setOpenaiKey] = useState("")
  const [anthropicKey, setAnthropicKey] = useState("")
  const [trainingData, setTrainingData] = useState("")
  const [saving, setSaving] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.chatbot_provider) setProvider(data.chatbot_provider)
        if (data.gemini_api_key) setGeminiKey(data.gemini_api_key)
        if (data.openai_api_key) setOpenaiKey(data.openai_api_key)
        if (data.anthropic_api_key) setAnthropicKey(data.anthropic_api_key)
        if (data.chatbot_training_data) setTrainingData(data.chatbot_training_data)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatbot_provider: provider,
        gemini_api_key: geminiKey,
        openai_api_key: openaiKey,
        anthropic_api_key: anthropicKey,
        chatbot_training_data: trainingData,
      })
    })
    setSaving(false)
    router.refresh()
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Chatbot & AI Configuration</h1>
        <p className="text-white/60 mt-1">Configure your AI providers and train the Metplast chatbot.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Active Provider</h2>
          <select 
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
          >
            <option value="gemini">Google Gemini</option>
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic (Claude)</option>
          </select>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-2">API Keys</h2>
          
          <div>
            <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Gemini API Key</label>
            <input 
              type="password" 
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors"
              placeholder="AIzaSy..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">OpenAI API Key</label>
            <input 
              type="password" 
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors"
              placeholder="sk-..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Anthropic API Key</label>
            <input 
              type="password" 
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors"
              placeholder="sk-ant-..."
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-4">Training Knowledge Base</h2>
          <p className="text-white/50 text-sm mb-4">
            Paste everything the chatbot needs to know about Metplast, products, pricing, and policies. It will use this data to answer customer questions.
          </p>
          <textarea 
            rows={10}
            value={trainingData}
            onChange={(e) => setTrainingData(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors"
            placeholder="Metplast is a leading manufacturer of poultry equipment..."
          />
        </div>

        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </div>
  )
}
