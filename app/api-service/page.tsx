"use client";

import { useState } from "react";

export default function APIServicePage() {
  const [messages, setMessages] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("deepseek/deepseek-chat");

  const callAPI = async () => {
    if (!messages.trim()) return;
    
    setLoading(true);
    setResponse("");
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [{ role: 'user', content: messages }],
          model: selectedModel
        })
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse("Error: " + error);
    }
    setLoading(false);
  };

  const models = [
    { id: "deepseek/deepseek-chat", name: "DeepSeek V3", input: "$0.14", output: "$0.28" },
    { id: "openai/gpt-4o-mini", name: "GPT-4o mini", input: "$0.15", output: "$0.60" },
    { id: "openai/gpt-4o", name: "GPT-4o", input: "$2.50", output: "$10.00" },
    { id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku", input: "$0.25", output: "$1.25" },
    { id: "anthropic/claude-3-sonnet", name: "Claude 3 Sonnet", input: "$3.00", output: "$15.00" },
    { id: "google/gemini-flash-1.5", name: "Gemini 1.5 Flash", input: "$0.075", output: "$0.30" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Inferly API
              </h1>
              <p className="text-gray-400 text-sm mt-1">Cost-optimized AI API access</p>
            </div>
            <a href="/" className="text-gray-400 hover:text-white text-sm transition">
              ← Back to Home
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Pay less for AI</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get access to top AI models at 50% lower cost. 
            We automatically route to the cheapest provider.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 text-center">
            <div className="text-3xl font-bold text-green-500">$0.004</div>
            <div className="text-gray-400 text-sm mb-2">per 1K tokens</div>
            <div className="text-xs text-gray-500">DeepSeek V3</div>
            <div className="mt-4 text-sm text-gray-400">⚡ 50% savings</div>
          </div>
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 text-center relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
              Most Popular
            </div>
            <div className="text-3xl font-bold text-blue-500">$0.008</div>
            <div className="text-gray-400 text-sm mb-2">per 1K tokens</div>
            <div className="text-xs text-gray-500">GPT-4o mini</div>
            <div className="mt-4 text-sm text-gray-400">🎯 Best balance</div>
          </div>
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 text-center">
            <div className="text-3xl font-bold text-purple-500">$0.03</div>
            <div className="text-gray-400 text-sm mb-2">per 1K tokens</div>
            <div className="text-xs text-gray-500">GPT-4o / Claude</div>
            <div className="mt-4 text-sm text-gray-400">🧠 Best quality</div>
          </div>
        </div>

        {/* API Call Demo */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-12">
          <h3 className="text-lg font-semibold mb-4">Try it now</h3>
          
          {/* Model Selector */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Select Model</label>
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full md:w-64 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
            >
              {models.map(m => (
                <option key={m.id} value={m.id}>{m.name} (${m.input}/M input)</option>
              ))}
            </select>
          </div>

          {/* Input */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Your Prompt</label>
            <textarea 
              value={messages}
              onChange={(e) => setMessages(e.target.value)}
              placeholder="e.g., Explain quantum computing in simple terms..."
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500"
              rows={3}
            />
          </div>

          {/* Button */}
          <button 
            onClick={callAPI}
            disabled={loading || !messages.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition"
          >
            {loading ? "Calling API..." : "Call API"}
          </button>

          {/* Response */}
          {response && (
            <div className="mt-4">
              <label className="block text-sm text-gray-400 mb-2">Response (with pricing)</label>
              <pre className="p-4 bg-gray-800 rounded-lg overflow-x-auto text-xs text-gray-300">
                {response}
              </pre>
            </div>
          )}
        </div>

        {/* Code Example */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Start</h3>
          <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm text-gray-300">
{`curl -X POST https://ai-model-compare-eight.vercel.app/api/chat \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [{"role": "user", "content": "Hello, AI!"}],
    "model": "deepseek/deepseek-chat"
  }'`}
          </pre>
          <div className="mt-4 text-sm text-gray-400">
            💡 The response includes <code className="text-green-400">inferly_pricing</code> showing your savings.
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>Pay only for what you use. No monthly commitment.</p>
          <p className="mt-1">Questions? Contact us at api@inferly.com</p>
        </div>
      </main>
    </div>
  );
}
