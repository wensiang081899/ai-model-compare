"use client";

import { useState } from "react";

const models = [
  // OpenAI 系列
  { name: "GPT-4o", provider: "OpenAI", inputPrice: 2.50, outputPrice: 10.00, context: "128K", speed: "Fast", useCase: "通用/Coding" },
  { name: "GPT-4o mini", provider: "OpenAI", inputPrice: 0.15, outputPrice: 0.60, context: "128K", speed: "Fast", useCase: "轻量任务" },
  { name: "GPT-4.5", provider: "OpenAI", inputPrice: 75.00, outputPrice: 150.00, context: "128K", speed: "Medium", useCase: "复杂推理" },
  
  // Anthropic Claude 系列
  { name: "Claude 3.5 Sonnet", provider: "Anthropic", inputPrice: 3.00, outputPrice: 15.00, context: "200K", speed: "Fast", useCase: "复杂任务/Coding" },
  { name: "Claude 3 Opus", provider: "Anthropic", inputPrice: 15.00, outputPrice: 75.00, context: "200K", speed: "Medium", useCase: "高难度任务" },
  
  // Google Gemini 系列
  { name: "Gemini 1.5 Pro", provider: "Google", inputPrice: 1.25, outputPrice: 5.00, context: "2M", speed: "Fast", useCase: "长上下文" },
  { name: "Gemini 1.5 Flash", provider: "Google", inputPrice: 0.075, outputPrice: 0.30, context: "1M", speed: "Fast", useCase: "快速响应" },
  { name: "Gemini 2.0 Flash", provider: "Google", inputPrice: 0.10, outputPrice: 0.40, context: "1M", speed: "Fast", useCase: "最新版本" },
  
  // DeepSeek
  { name: "DeepSeek V3", provider: "DeepSeek", inputPrice: 0.14, outputPrice: 0.28, context: "128K", speed: "Fast", useCase: "性价比之王" },
  { name: "DeepSeek R1", provider: "DeepSeek", inputPrice: 0.55, outputPrice: 2.19, context: "128K", speed: "Medium", useCase: "推理任务" },
  
  // Groq (超快)
  { name: "Llama 3.3 70B", provider: "Groq", inputPrice: 0.70, outputPrice: 0.80, context: "128K", speed: "Very Fast", useCase: "实时应用" },
  
  // Together AI
  { name: "Llama 3.1 405B", provider: "Together AI", inputPrice: 5.00, outputPrice: 5.00, context: "128K", speed: "Medium", useCase: "超大模型" },
  
  // Mistral
  { name: "Mixtral 8x22B", provider: "Mistral", inputPrice: 2.00, outputPrice: 6.00, context: "64K", speed: "Fast", useCase: "开源首选" },
  
  // Cohere
  { name: "Command R+", provider: "Cohere", inputPrice: 2.50, outputPrice: 10.00, context: "128K", speed: "Medium", useCase: "RAG应用" },
];

const getBlendedPrice = (model: { inputPrice: number; outputPrice: number }) => {
  return (model.inputPrice + model.outputPrice) / 2;
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("none");

  // 过滤模型
  let filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 排序模型
  if (sortType === "cheapest") {
    filteredModels = [...filteredModels].sort((a, b) => getBlendedPrice(a) - getBlendedPrice(b));
  } else if (sortType === "fastest") {
    const speedOrder = { "Very Fast": 1, "Fast": 2, "Medium": 3 };
    filteredModels = [...filteredModels].sort((a, b) => 
      (speedOrder[a.speed as keyof typeof speedOrder] || 999) - 
      (speedOrder[b.speed as keyof typeof speedOrder] || 999)
    );
  } else if (sortType === "context") {
    filteredModels = [...filteredModels].sort((a, b) => {
      const getContextNum = (ctx: string) => parseInt(ctx) || 0;
      return getContextNum(b.context) - getContextNum(a.context);
    });
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            AI Token Compare
          </h1>
          <p className="text-gray-400 mt-1">对比 AI 模型价格，找到最划算的选择</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 搜索框和排序按钮 */}
        <div className="mb-6 space-y-4">
          {/* 搜索框 */}
          <input
            type="text"
            placeholder="🔍 搜索模型或提供商..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />

          {/* 排序按钮 */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSortType("cheapest")}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                sortType === "cheapest" 
                  ? "bg-green-600 text-white" 
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              💰 最便宜
            </button>
            <button
              onClick={() => setSortType("fastest")}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                sortType === "fastest" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              ⚡ 最快速度
            </button>
            <button
              onClick={() => setSortType("context")}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                sortType === "context" 
                  ? "bg-purple-600 text-white" 
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              📚 最长上下文
            </button>
            {sortType !== "none" && (
              <button
                onClick={() => setSortType("none")}
                className="px-3 py-1.5 rounded-lg text-sm bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                取消排序
              </button>
            )}
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="text-gray-400 text-sm">模型总数</div>
            <div className="text-2xl font-bold text-white">{filteredModels.length}</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="text-gray-400 text-sm">最便宜输入</div>
            <div className="text-2xl font-bold text-green-400">
              ${Math.min(...filteredModels.map(m => m.inputPrice)).toFixed(3)}/M
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="text-gray-400 text-sm">最快速度</div>
            <div className="text-2xl font-bold text-blue-400">
              {filteredModels.some(m => m.speed === "Very Fast") ? "Groq" : "Fast"}
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="text-gray-400 text-sm">最长上下文</div>
            <div className="text-2xl font-bold text-purple-400">
              {Math.max(...filteredModels.map(m => parseInt(m.context) || 0))}K
            </div>
          </div>
        </div>

        {/* 表格 */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr className="text-left text-gray-300 text-sm">
                  <th className="px-4 py-3">模型</th>
                  <th className="px-4 py-3">提供商</th>
                  <th className="px-4 py-3">输入 ($/M)</th>
                  <th className="px-4 py-3">输出 ($/M)</th>
                  <th className="px-4 py-3">混合价</th>
                  <th className="px-4 py-3">上下文</th>
                  <th className="px-4 py-3">速度</th>
                  <th className="px-4 py-3">推荐用途</th>
                </tr>
              </thead>
              <tbody>
                {filteredModels.map((model, idx) => (
                  <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800 transition">
                    <td className="px-4 py-3 font-medium text-white">{model.name}</td>
                    <td className="px-4 py-3 text-gray-300">{model.provider}</td>
                    <td className="px-4 py-3 text-green-400">${model.inputPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-yellow-400">${model.outputPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-blue-400">${getBlendedPrice(model).toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-300">{model.context}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        model.speed === 'Very Fast' ? 'bg-green-500/20 text-green-400' :
                        model.speed === 'Fast' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {model.speed}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{model.useCase}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-xs">
          价格单位: 每 100 万 tokens | 数据更新时间: 2026-01-16 | 点击按钮可排序
        </div>
      </main>
    </div>
  );
}
