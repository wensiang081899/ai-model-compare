"use client";

import { useState, useCallback } from "react";
import { Sun, Moon, Copy, Check, ExternalLink } from "lucide-react";

type Model = {
  name: string;
  provider: string;
  inputPrice: number;
  outputPrice: number;
  context: string;
  speed: string;
  useCase: string;
  officialUrl: string;
};

const models: Model[] = [
  // OpenAI 系列
  {
    name: "GPT-5",
    provider: "OpenAI",
    inputPrice: 5.0,
    outputPrice: 15.0,
    context: "256K",
    speed: "Fast",
    useCase: "旗舰通用",
    officialUrl: "https://openai.com",
  },
  {
    name: "GPT-4o",
    provider: "OpenAI",
    inputPrice: 2.5,
    outputPrice: 10.0,
    context: "128K",
    speed: "Fast",
    useCase: "通用/Coding",
    officialUrl: "https://openai.com",
  },
  {
    name: "GPT-4o mini",
    provider: "OpenAI",
    inputPrice: 0.15,
    outputPrice: 0.6,
    context: "128K",
    speed: "Fast",
    useCase: "轻量任务",
    officialUrl: "https://openai.com",
  },
  {
    name: "GPT-4.5",
    provider: "OpenAI",
    inputPrice: 75.0,
    outputPrice: 150.0,
    context: "128K",
    speed: "Medium",
    useCase: "复杂推理",
    officialUrl: "https://openai.com",
  },

  // Anthropic Claude 系列
  {
    name: "Claude 3.7 Sonnet",
    provider: "Anthropic",
    inputPrice: 3.0,
    outputPrice: 15.0,
    context: "200K",
    speed: "Fast",
    useCase: "Coding/复杂任务",
    officialUrl: "https://www.anthropic.com",
  },
  {
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    inputPrice: 3.0,
    outputPrice: 15.0,
    context: "200K",
    speed: "Fast",
    useCase: "复杂任务/Coding",
    officialUrl: "https://www.anthropic.com",
  },
  {
    name: "Claude 3 Opus",
    provider: "Anthropic",
    inputPrice: 15.0,
    outputPrice: 75.0,
    context: "200K",
    speed: "Medium",
    useCase: "高难度任务",
    officialUrl: "https://www.anthropic.com",
  },

  // Google Gemini 系列
  {
    name: "Gemini 2.5 Pro",
    provider: "Google",
    inputPrice: 1.25,
    outputPrice: 10.0,
    context: "1M",
    speed: "Fast",
    useCase: "多模态/长上下文",
    officialUrl: "https://ai.google.dev",
  },
  {
    name: "Gemini 1.5 Pro",
    provider: "Google",
    inputPrice: 1.25,
    outputPrice: 5.0,
    context: "2M",
    speed: "Fast",
    useCase: "长上下文",
    officialUrl: "https://ai.google.dev",
  },
  {
    name: "Gemini 1.5 Flash",
    provider: "Google",
    inputPrice: 0.075,
    outputPrice: 0.3,
    context: "1M",
    speed: "Fast",
    useCase: "快速响应",
    officialUrl: "https://ai.google.dev",
  },

  // DeepSeek
  {
    name: "DeepSeek V4",
    provider: "DeepSeek",
    inputPrice: 0.2,
    outputPrice: 0.4,
    context: "128K",
    speed: "Fast",
    useCase: "新一代性价比",
    officialUrl: "https://www.deepseek.com",
  },
  {
    name: "DeepSeek V3",
    provider: "DeepSeek",
    inputPrice: 0.14,
    outputPrice: 0.28,
    context: "128K",
    speed: "Fast",
    useCase: "性价比之王",
    officialUrl: "https://www.deepseek.com",
  },
  {
    name: "DeepSeek R1",
    provider: "DeepSeek",
    inputPrice: 0.55,
    outputPrice: 2.19,
    context: "128K",
    speed: "Medium",
    useCase: "推理任务",
    officialUrl: "https://www.deepseek.com",
  },

  // Meta Llama
  {
    name: "Llama 4",
    provider: "Meta",
    inputPrice: 0.5,
    outputPrice: 0.5,
    context: "128K",
    speed: "Fast",
    useCase: "开源旗舰",
    officialUrl: "https://ai.meta.com",
  },
  {
    name: "Llama 3.3 70B",
    provider: "Groq",
    inputPrice: 0.7,
    outputPrice: 0.8,
    context: "128K",
    speed: "Very Fast",
    useCase: "实时应用",
    officialUrl: "https://groq.com",
  },
  {
    name: "Llama 3.1 405B",
    provider: "Together AI",
    inputPrice: 5.0,
    outputPrice: 5.0,
    context: "128K",
    speed: "Medium",
    useCase: "超大模型",
    officialUrl: "https://www.together.ai",
  },

  // 其他
  {
    name: "Mixtral 8x22B",
    provider: "Mistral",
    inputPrice: 2.0,
    outputPrice: 6.0,
    context: "64K",
    speed: "Fast",
    useCase: "开源首选",
    officialUrl: "https://mistral.ai",
  },
  {
    name: "Command R+",
    provider: "Cohere",
    inputPrice: 2.5,
    outputPrice: 10.0,
    context: "128K",
    speed: "Medium",
    useCase: "RAG应用",
    officialUrl: "https://cohere.com",
  },
];

const getBlendedPrice = (model: { inputPrice: number; outputPrice: number }) =>
  (model.inputPrice + model.outputPrice) / 2;

function formatToday(): string {
  const now = new Date();
  return now.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const updateDate = formatToday();

  const copyModelName = useCallback(async (name: string) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopiedName(name);
      setTimeout(() => setCopiedName(null), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }, []);

  const theme = isDark
    ? {
        page: "bg-black text-white",
        header: "border-gray-800",
        subtitle: "text-gray-400",
        card: "bg-gray-900 border-gray-800",
        cardLabel: "text-gray-400",
        table: "bg-gray-900 border-gray-800",
        thead: "bg-gray-800 border-gray-700 text-gray-300",
        row: "border-gray-800 hover:bg-gray-800",
        cell: "text-gray-300",
        updateBanner: "bg-blue-500/10 border-blue-500/30 text-blue-300",
        btn: "bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700",
        btnPrimary: "bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-700",
        footer: "text-gray-500",
        toggle: "bg-gray-800 hover:bg-gray-700 text-yellow-400",
      }
    : {
        page: "bg-gray-50 text-gray-900",
        header: "border-gray-200",
        subtitle: "text-gray-500",
        card: "bg-white border-gray-200 shadow-sm",
        cardLabel: "text-gray-500",
        table: "bg-white border-gray-200 shadow-sm",
        thead: "bg-gray-100 border-gray-200 text-gray-600",
        row: "border-gray-100 hover:bg-gray-50",
        cell: "text-gray-600",
        updateBanner: "bg-blue-50 border-blue-200 text-blue-700",
        btn: "bg-gray-100 hover:bg-gray-200 text-gray-600 border-gray-200",
        btnPrimary: "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200",
        footer: "text-gray-400",
        toggle: "bg-gray-100 hover:bg-gray-200 text-amber-500",
      };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme.page}`}>
      <header className={`border-b ${theme.header}`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-display">
                AI TOKEN
              </h1>
              <p className={`mt-1 ${theme.subtitle}`}>智能模型价格对比</p>
            </div>
            <button
              type="button"
              onClick={() => setIsDark((d) => !d)}
              className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ${theme.toggle}`}
              aria-label={isDark ? "切换到亮色模式" : "切换到暗色模式"}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <div
            className={`mt-4 px-4 py-2.5 rounded-lg border text-sm ${theme.updateBanner}`}
          >
            数据更新时间：{updateDate} · 价格仅供参考，请以各厂商官网为准
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`rounded-lg p-4 border ${theme.card}`}>
            <div className={`text-sm ${theme.cardLabel}`}>模型总数</div>
            <div className="text-2xl font-bold">{models.length}</div>
          </div>
          <div className={`rounded-lg p-4 border ${theme.card}`}>
            <div className={`text-sm ${theme.cardLabel}`}>最便宜输入</div>
            <div className="text-2xl font-bold text-green-500">
              ${Math.min(...models.map((m) => m.inputPrice)).toFixed(3)}/M
            </div>
          </div>
          <div className={`rounded-lg p-4 border ${theme.card}`}>
            <div className={`text-sm ${theme.cardLabel}`}>最快速度</div>
            <div className="text-2xl font-bold text-blue-500">Groq</div>
          </div>
          <div className={`rounded-lg p-4 border ${theme.card}`}>
            <div className={`text-sm ${theme.cardLabel}`}>最长上下文</div>
            <div className="text-2xl font-bold text-purple-500">2M</div>
          </div>
        </div>

        <div className={`rounded-xl border overflow-hidden ${theme.table}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`border-b ${theme.thead}`}>
                <tr className="text-left text-sm">
                  <th className="px-4 py-3">模型</th>
                  <th className="px-4 py-3">提供商</th>
                  <th className="px-4 py-3">输入 ($/M)</th>
                  <th className="px-4 py-3">输出 ($/M)</th>
                  <th className="px-4 py-3">混合价</th>
                  <th className="px-4 py-3">上下文</th>
                  <th className="px-4 py-3">速度</th>
                  <th className="px-4 py-3">推荐用途</th>
                  <th className="px-4 py-3">操作</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => (
                  <tr
                    key={model.name}
                    className={`border-b transition ${theme.row}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{model.name}</span>
                        <button
                          type="button"
                          onClick={() => copyModelName(model.name)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border transition ${theme.btn}`}
                          title="复制模型名称"
                        >
                          {copiedName === model.name ? (
                            <>
                              <Check size={12} className="text-green-500" />
                              已复制
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              复制名称
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className={`px-4 py-3 ${theme.cell}`}>{model.provider}</td>
                    <td className="px-4 py-3 text-green-500">
                      ${model.inputPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-yellow-500">
                      ${model.outputPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-blue-500">
                      ${getBlendedPrice(model).toFixed(2)}
                    </td>
                    <td className={`px-4 py-3 ${theme.cell}`}>{model.context}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          model.speed === "Very Fast"
                            ? "bg-green-500/20 text-green-500"
                            : model.speed === "Fast"
                              ? "bg-blue-500/20 text-blue-500"
                              : "bg-yellow-500/20 text-yellow-500"
                        }`}
                      >
                        {model.speed}
                      </span>
                    </td>
                    <td className={`px-4 py-3 ${theme.cell}`}>{model.useCase}</td>
                    <td className="px-4 py-3">
                      <a
                        href={model.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs border transition ${theme.btnPrimary}`}
                      >
                        <ExternalLink size={12} />
                        官网
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`mt-6 text-center text-xs ${theme.footer}`}>
          价格单位: 每 100 万 tokens · 数据更新时间: {updateDate}
        </div>
      </main>
    </div>
  );
}
