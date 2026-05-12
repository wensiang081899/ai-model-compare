const models = [
  { name: "GPT-4o", provider: "OpenAI", inputPrice: 2.50, outputPrice: 10.00, context: "128K", speed: "Fast", useCase: "通用/Coding" },
  { name: "GPT-4o mini", provider: "OpenAI", inputPrice: 0.15, outputPrice: 0.60, context: "128K", speed: "Fast", useCase: "轻量任务" },
  { name: "Claude 3.5 Sonnet", provider: "Anthropic", inputPrice: 3.00, outputPrice: 15.00, context: "200K", speed: "Fast", useCase: "复杂任务" },
  { name: "Gemini 1.5 Pro", provider: "Google", inputPrice: 1.25, outputPrice: 5.00, context: "2M", speed: "Fast", useCase: "长上下文" },
  { name: "Gemini 1.5 Flash", provider: "Google", inputPrice: 0.075, outputPrice: 0.30, context: "1M", speed: "Fast", useCase: "快速响应" },
  { name: "DeepSeek V3", provider: "DeepSeek", inputPrice: 0.14, outputPrice: 0.28, context: "128K", speed: "Fast", useCase: "性价比之王" },
  { name: "Llama 3.3 70B", provider: "Groq", inputPrice: 0.70, outputPrice: 0.80, context: "128K", speed: "Very Fast", useCase: "实时应用" },
];

const getBlendedPrice = (model: { inputPrice: number; outputPrice: number }) => {
  return (model.inputPrice + model.outputPrice) / 2;
};

export default function Home() {
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
                {models.map((model, idx) => (
                  <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800 transition">
                    <td className="px-4 py-3 font-medium text-white">{model.name}</td>
                    <td className="px-4 py-3 text-gray-300">{model.provider}</td>
                    <td className="px-4 py-3 text-green-400">${model.inputPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-yellow-400">${model.outputPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-blue-400">${getBlendedPrice(model).toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-300">{model.context}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">
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
      </main>
    </div>
  );
}
