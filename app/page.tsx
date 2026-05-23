"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Sun,
  Moon,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Calculator,
  Search,
} from "lucide-react";

type Lang = "zh" | "en";

type ModelCategory = "all" | "text" | "image" | "embedding" | "audio";

type Model = {
  name: string;
  provider: string;
  inputPrice: number;
  outputPrice: number;
  context: string;
  speed: string;
  useCase: string;
  officialUrl: string;
  category: ModelCategory;
};

type PriceTrend = "up" | "down" | "flat";

type LiveModel = Model & {
  inputTrend: PriceTrend;
  outputTrend: PriceTrend;
  inputChangePct: number;
  outputChangePct: number;
};

type UseCaseFilter = "all" | "coding" | "long-context" | "value" | "fast";
type RecommendType = "coding" | "writing" | "agent" | "fast";

const translations = {
  zh: {
    subtitle: "智能模型价格对比",
    switchToLight: "切换到亮色模式",
    switchToDark: "切换到暗色模式",
    switchToEn: "切换到 English",
    switchToZh: "切换到中文",
    updateBannerPrefix: "数据更新时间：",
    updateBannerSuffix: " · 价格仅供参考，请以各厂商官网为准",
    refreshPrices: "刷新模拟价格",
    lastRefresh: "上次刷新时间：",
    notRefreshed: "尚未刷新",
    statTotalModels: "模型总数",
    statCheapestInput: "最便宜输入",
    statFastest: "最快速度",
    statLongestContext: "最长上下文",
    costCalculator: "成本计算器",
    monthlyUsage: "每月使用量（百万 Token）",
    monthlyUsagePlaceholder: "例如 10",
    costEstimateHint: "按 50% 输入 + 50% 输出估算月成本",
    cheapestTop3: "最便宜推荐（Top 3）",
    perMonth: "/月",
    calcModel: "模型",
    calcProvider: "提供商",
    calcMonthlyCost: "预估月成本",
    searchPlaceholder: "搜索模型、提供商或用途...",
    filterAria: "推荐用途筛选",
    filterAll: "全部用途",
    filterCoding: "编程 / Coding",
    filterLongContext: "长上下文",
    filterValue: "性价比",
    filterFast: "快速响应",
    categoryAll: "全部类型",
    categoryText: "🔤 文本生成",
    categoryImage: "🖼️ 图像生成",
    categoryEmbedding: "📊 嵌入/向量",
    categoryAudio: "🎤 音频/语音",
    showingModels: (shown: number, total: number) =>
      `显示 ${shown} / ${total} 个模型`,
    thModel: "模型",
    thProvider: "提供商",
    thInput: "输入 ($/M)",
    thOutput: "输出 ($/M)",
    thBlended: "混合价",
    thContext: "上下文",
    thSpeed: "速度",
    thUseCase: "推荐用途",
    thActions: "操作",
    noResults: "没有匹配的模型，请调整搜索或筛选条件",
    copyName: "复制名称",
    copied: "已复制",
    copyTitle: "复制模型名称",
    officialSite: "官网",
    footerPriceUnit: "价格单位: 每 100 万 tokens",
    footerUpdated: "数据更新时间: ",
    footerSimRefresh: "模拟价格刷新: ",
    // AI 推荐引擎翻译
    recommendTitle: "🤖 AI 推荐引擎 - 找到最适合你的模型",
    recommendDesc: "选择你的场景和预算，我们帮你推荐",
    btnCoding: "🧠 编程 / Coding",
    btnWriting: "📝 写作 / 总结",
    btnAgent: "🤖 AI Agent / 自动化",
    btnFast: "⚡ 快速响应 / 实时聊天",
    monthlyBudget: "💰 每月预算",
    bestPick: "最佳选择",
    valuePick: "性价比之选",
    fastestPick: "最快响应",
    reasonCoding: "🧠 编程能力最强，代码质量最高",
    reasonValue: "💰 成本最低，编程能力优秀",
    reasonFast: "⚡ 延迟最低，适合实时对话",
    clickHint: "💡 点击场景按钮，推荐内容会根据你的选择变化",
  },
  en: {
    subtitle: "AI Model Price Comparison",
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
    switchToEn: "Switch to English",
    switchToZh: "Switch to 中文",
    updateBannerPrefix: "Last updated: ",
    updateBannerSuffix:
      " · Prices are for reference only; check each vendor's official site.",
    refreshPrices: "Refresh simulated prices",
    lastRefresh: "Last refresh: ",
    notRefreshed: "Not refreshed yet",
    statTotalModels: "Total models",
    statCheapestInput: "Cheapest input",
    statFastest: "Fastest",
    statLongestContext: "Longest context",
    costCalculator: "Cost Calculator",
    monthlyUsage: "Monthly usage (M tokens)",
    monthlyUsagePlaceholder: "e.g. 10",
    costEstimateHint: "Estimated monthly cost at 50% input + 50% output",
    cheapestTop3: "Cheapest picks (Top 3)",
    perMonth: "/mo",
    calcModel: "Model",
    calcProvider: "Provider",
    calcMonthlyCost: "Est. monthly cost",
    searchPlaceholder: "Search models, providers, or use cases...",
    filterAria: "Filter by use case",
    filterAll: "All use cases",
    filterCoding: "Coding",
    filterLongContext: "Long context",
    filterValue: "Best value",
    filterFast: "Fast response",
    categoryAll: "All Types",
    categoryText: "🔤 Text Generation",
    categoryImage: "🖼️ Image Generation",
    categoryEmbedding: "📊 Embedding/Vector",
    categoryAudio: "🎤 Audio/Speech",
    showingModels: (shown: number, total: number) =>
      `Showing ${shown} / ${total} models`,
    thModel: "Model",
    thProvider: "Provider",
    thInput: "Input ($/M)",
    thOutput: "Output ($/M)",
    thBlended: "Blended",
    thContext: "Context",
    thSpeed: "Speed",
    thUseCase: "Use case",
    thActions: "Actions",
    noResults: "No matching models. Adjust search or filters.",
    copyName: "Copy name",
    copied: "Copied",
    copyTitle: "Copy model name",
    officialSite: "Official site",
    footerPriceUnit: "Prices per 1M tokens",
    footerUpdated: "Data updated: ",
    footerSimRefresh: "Simulated price refresh: ",
    // AI Recommendation Engine
    recommendTitle: "🤖 AI Recommendation Engine - Find Your Perfect Model",
    recommendDesc: "Select your scenario and budget, we'll recommend",
    btnCoding: "🧠 Coding",
    btnWriting: "📝 Writing / Summary",
    btnAgent: "🤖 AI Agent / Automation",
    btnFast: "⚡ Fast Response / Real-time Chat",
    monthlyBudget: "💰 Monthly Budget",
    bestPick: "Best Pick",
    valuePick: "Best Value",
    fastestPick: "Fastest Response",
    reasonCoding: "🧠 Strongest coding ability, highest code quality",
    reasonValue: "💰 Lowest cost, excellent coding ability",
    reasonFast: "⚡ Lowest latency, suitable for real-time chat",
    clickHint: "💡 Click the scenario buttons, recommendations will change",
  },
} as const;

const USE_CASE_FILTER_LABELS: Record<
  Lang,
  { value: UseCaseFilter; labelKey: keyof (typeof translations)["zh"] }[]
> = {
  zh: [
    { value: "all", labelKey: "filterAll" },
    { value: "coding", labelKey: "filterCoding" },
    { value: "long-context", labelKey: "filterLongContext" },
    { value: "value", labelKey: "filterValue" },
    { value: "fast", labelKey: "filterFast" },
  ],
  en: [
    { value: "all", labelKey: "filterAll" },
    { value: "coding", labelKey: "filterCoding" },
    { value: "long-context", labelKey: "filterLongContext" },
    { value: "value", labelKey: "filterValue" },
    { value: "fast", labelKey: "filterFast" },
  ],
};

const baseModels: Model[] = [
  // OpenAI 系列
  { name: "GPT-5", provider: "OpenAI", inputPrice: 5.0, outputPrice: 15.0, context: "256K", speed: "Fast", useCase: "旗舰通用", officialUrl: "https://openai.com", category: "text" },
  { name: "GPT-4o", provider: "OpenAI", inputPrice: 2.5, outputPrice: 10.0, context: "128K", speed: "Fast", useCase: "通用/Coding", officialUrl: "https://openai.com", category: "text" },
  { name: "GPT-4o mini", provider: "OpenAI", inputPrice: 0.15, outputPrice: 0.6, context: "128K", speed: "Fast", useCase: "轻量任务", officialUrl: "https://openai.com", category: "text" },
  { name: "GPT-4 Turbo", provider: "OpenAI", inputPrice: 10.0, outputPrice: 30.0, context: "128K", speed: "Fast", useCase: "高精度任务", officialUrl: "https://openai.com", category: "text" },
  { name: "GPT-4.5", provider: "OpenAI", inputPrice: 75.0, outputPrice: 150.0, context: "128K", speed: "Medium", useCase: "复杂推理", officialUrl: "https://openai.com", category: "text" },
  { name: "o1-preview", provider: "OpenAI", inputPrice: 15.0, outputPrice: 60.0, context: "128K", speed: "Slow", useCase: "深度推理", officialUrl: "https://openai.com", category: "text" },
  { name: "o1-mini", provider: "OpenAI", inputPrice: 3.0, outputPrice: 12.0, context: "128K", speed: "Medium", useCase: "快速推理", officialUrl: "https://openai.com", category: "text" },
  // Anthropic 系列
  { name: "Claude 3.7 Sonnet", provider: "Anthropic", inputPrice: 3.0, outputPrice: 15.0, context: "200K", speed: "Fast", useCase: "Coding/复杂任务", officialUrl: "https://www.anthropic.com", category: "text" },
  { name: "Claude 3.5 Sonnet", provider: "Anthropic", inputPrice: 3.0, outputPrice: 15.0, context: "200K", speed: "Fast", useCase: "复杂任务/Coding", officialUrl: "https://www.anthropic.com", category: "text" },
  { name: "Claude 3 Opus", provider: "Anthropic", inputPrice: 15.0, outputPrice: 75.0, context: "200K", speed: "Medium", useCase: "高难度任务", officialUrl: "https://www.anthropic.com", category: "text" },
  { name: "Claude 3 Haiku", provider: "Anthropic", inputPrice: 0.25, outputPrice: 1.25, context: "200K", speed: "Very Fast", useCase: "高速低成本", officialUrl: "https://www.anthropic.com", category: "text" },
  // Google 系列
  { name: "Gemini 2.5 Pro", provider: "Google", inputPrice: 1.25, outputPrice: 10.0, context: "1M", speed: "Fast", useCase: "多模态/长上下文", officialUrl: "https://ai.google.dev", category: "text" },
  { name: "Gemini 1.5 Pro", provider: "Google", inputPrice: 1.25, outputPrice: 5.0, context: "2M", speed: "Fast", useCase: "长上下文", officialUrl: "https://ai.google.dev", category: "text" },
  { name: "Gemini 1.5 Flash", provider: "Google", inputPrice: 0.075, outputPrice: 0.3, context: "1M", speed: "Fast", useCase: "快速响应", officialUrl: "https://ai.google.dev", category: "text" },
  { name: "Gemini 1.0 Pro", provider: "Google", inputPrice: 0.5, outputPrice: 1.5, context: "32K", speed: "Fast", useCase: "基础任务", officialUrl: "https://ai.google.dev", category: "text" },
  // DeepSeek 系列
  { name: "DeepSeek V4", provider: "DeepSeek", inputPrice: 0.2, outputPrice: 0.4, context: "128K", speed: "Fast", useCase: "新一代性价比", officialUrl: "https://www.deepseek.com", category: "text" },
  { name: "DeepSeek V3", provider: "DeepSeek", inputPrice: 0.14, outputPrice: 0.28, context: "128K", speed: "Fast", useCase: "性价比之王", officialUrl: "https://www.deepseek.com", category: "text" },
  { name: "DeepSeek V2.5", provider: "DeepSeek", inputPrice: 0.10, outputPrice: 0.20, context: "128K", speed: "Fast", useCase: "平衡版", officialUrl: "https://www.deepseek.com", category: "text" },
  { name: "DeepSeek R1", provider: "DeepSeek", inputPrice: 0.55, outputPrice: 2.19, context: "128K", speed: "Medium", useCase: "推理任务", officialUrl: "https://www.deepseek.com", category: "text" },
  // 中国模型
  { name: "GLM-4", provider: "智谱AI", inputPrice: 0.14, outputPrice: 0.28, context: "128K", speed: "Fast", useCase: "中文优化", officialUrl: "https://zhipu.ai", category: "text" },
  { name: "GLM-4-Plus", provider: "智谱AI", inputPrice: 0.28, outputPrice: 0.56, context: "128K", speed: "Fast", useCase: "复杂中文", officialUrl: "https://zhipu.ai", category: "text" },
  { name: "Qwen-Max", provider: "阿里", inputPrice: 0.28, outputPrice: 0.56, context: "128K", speed: "Fast", useCase: "多任务", officialUrl: "https://tongyi.aliyun.com", category: "text" },
  { name: "Qwen-Plus", provider: "阿里", inputPrice: 0.14, outputPrice: 0.28, context: "128K", speed: "Fast", useCase: "性价比", officialUrl: "https://tongyi.aliyun.com", category: "text" },
  { name: "ERNIE 4.0", provider: "百度", inputPrice: 0.56, outputPrice: 1.12, context: "128K", speed: "Fast", useCase: "中文理解", officialUrl: "https://yiyan.baidu.com", category: "text" },
  { name: "ERNIE-3.5", provider: "百度", inputPrice: 0.28, outputPrice: 0.56, context: "128K", speed: "Fast", useCase: "轻量中文", officialUrl: "https://yiyan.baidu.com", category: "text" },
  { name: "Yi-34B", provider: "零一万物", inputPrice: 0.30, outputPrice: 0.60, context: "32K", speed: "Fast", useCase: "开源中文", officialUrl: "https://01.ai", category: "text" },
  // Meta Llama 系列
  { name: "Llama 4", provider: "Meta", inputPrice: 0.5, outputPrice: 0.5, context: "128K", speed: "Fast", useCase: "开源旗舰", officialUrl: "https://ai.meta.com", category: "text" },
  { name: "Llama 3.3 70B", provider: "Groq", inputPrice: 0.7, outputPrice: 0.8, context: "128K", speed: "Very Fast", useCase: "实时应用", officialUrl: "https://groq.com", category: "text" },
  { name: "Llama 3.1 405B", provider: "Together AI", inputPrice: 5.0, outputPrice: 5.0, context: "128K", speed: "Medium", useCase: "超大模型", officialUrl: "https://together.ai", category: "text" },
  // Mistral 系列
  { name: "Mixtral 8x22B", provider: "Mistral", inputPrice: 2.0, outputPrice: 6.0, context: "64K", speed: "Fast", useCase: "开源首选", officialUrl: "https://mistral.ai", category: "text" },
  { name: "Mistral Large", provider: "Mistral", inputPrice: 8.0, outputPrice: 24.0, context: "32K", speed: "Fast", useCase: "顶级开源", officialUrl: "https://mistral.ai", category: "text" },
  { name: "Mistral Small", provider: "Mistral", inputPrice: 2.0, outputPrice: 6.0, context: "32K", speed: "Fast", useCase: "轻量高效", officialUrl: "https://mistral.ai", category: "text" },
  { name: "Codestral", provider: "Mistral", inputPrice: 1.0, outputPrice: 3.0, context: "32K", speed: "Fast", useCase: "代码专用", officialUrl: "https://mistral.ai", category: "text" },
  // 推理加速平台
  { name: "Groq (Llama 3.3 70B)", provider: "Groq", inputPrice: 0.7, outputPrice: 0.8, context: "128K", speed: "Very Fast", useCase: "最快推理", officialUrl: "https://groq.com", category: "text" },
  { name: "Fireworks AI", provider: "Fireworks", inputPrice: 0.7, outputPrice: 0.8, context: "128K", speed: "Very Fast", useCase: "高速推理", officialUrl: "https://fireworks.ai", category: "text" },
  { name: "Cerebras", provider: "Cerebras", inputPrice: 0.6, outputPrice: 0.7, context: "128K", speed: "Very Fast", useCase: "专用硬件", officialUrl: "https://cerebras.ai", category: "text" },
  { name: "SambaNova", provider: "SambaNova", inputPrice: 0.5, outputPrice: 0.6, context: "128K", speed: "Very Fast", useCase: "高效推理", officialUrl: "https://sambanova.ai", category: "text" },
  // Cohere 系列
  { name: "Command R+", provider: "Cohere", inputPrice: 2.5, outputPrice: 10.0, context: "128K", speed: "Medium", useCase: "RAG应用", officialUrl: "https://cohere.com", category: "text" },
  { name: "Command-R", provider: "Cohere", inputPrice: 1.5, outputPrice: 5.0, context: "128K", speed: "Fast", useCase: "RAG专用", officialUrl: "https://cohere.com", category: "text" },
  // AI21
  { name: "Jamba-1.5", provider: "AI21", inputPrice: 2.0, outputPrice: 8.0, context: "256K", speed: "Fast", useCase: "长上下文", officialUrl: "https://ai21.com", category: "text" },
  // 图像生成模型
  { name: "DALL-E 3", provider: "OpenAI", inputPrice: 0.04, outputPrice: 0.08, context: "image", speed: "Medium", useCase: "高质量生图", officialUrl: "https://openai.com", category: "image" },
  { name: "DALL-E 2", provider: "OpenAI", inputPrice: 0.02, outputPrice: 0.04, context: "image", speed: "Fast", useCase: "快速生图", officialUrl: "https://openai.com", category: "image" },
  { name: "Stable Diffusion 3", provider: "Stability AI", inputPrice: 0.035, outputPrice: 0.035, context: "image", speed: "Fast", useCase: "开源生图", officialUrl: "https://stability.ai", category: "image" },
  { name: "SDXL", provider: "Stability AI", inputPrice: 0.025, outputPrice: 0.025, context: "image", speed: "Fast", useCase: "基础生图", officialUrl: "https://stability.ai", category: "image" },
  { name: "Flux Pro", provider: "Flux", inputPrice: 0.05, outputPrice: 0.05, context: "image", speed: "Medium", useCase: "高真实感", officialUrl: "https://flux.ai", category: "image" },
  { name: "Midjourney", provider: "Midjourney", inputPrice: 0.05, outputPrice: 0.05, context: "image", speed: "Medium", useCase: "艺术风格", officialUrl: "https://midjourney.com", category: "image" },
  // 嵌入/向量模型
  { name: "text-embedding-3-small", provider: "OpenAI", inputPrice: 0.02, outputPrice: 0.02, context: "embed", speed: "Fast", useCase: "通用嵌入", officialUrl: "https://openai.com", category: "embedding" },
  { name: "text-embedding-3-large", provider: "OpenAI", inputPrice: 0.13, outputPrice: 0.13, context: "embed", speed: "Fast", useCase: "高精度嵌入", officialUrl: "https://openai.com", category: "embedding" },
  { name: "voyage-2", provider: "Voyage AI", inputPrice: 0.04, outputPrice: 0.04, context: "embed", speed: "Fast", useCase: "RAG优化", officialUrl: "https://voyage.ai", category: "embedding" },
  { name: "cohere-embed-v3", provider: "Cohere", inputPrice: 0.05, outputPrice: 0.05, context: "embed", speed: "Fast", useCase: "多语言嵌入", officialUrl: "https://cohere.com", category: "embedding" },
  // 音频/语音模型
  { name: "Whisper", provider: "OpenAI", inputPrice: 0.006, outputPrice: 0.006, context: "audio", speed: "Fast", useCase: "语音转文字", officialUrl: "https://openai.com", category: "audio" },
  { name: "TTS HD", provider: "OpenAI", inputPrice: 0.015, outputPrice: 0.015, context: "audio", speed: "Fast", useCase: "高质量语音", officialUrl: "https://openai.com", category: "audio" },
  { name: "ElevenLabs", provider: "ElevenLabs", inputPrice: 0.30, outputPrice: 0.30, context: "audio", speed: "Fast", useCase: "自然语音", officialUrl: "https://elevenlabs.io", category: "audio" },
];

const getBlendedPrice = (model: { inputPrice: number; outputPrice: number }) =>
  (model.inputPrice + model.outputPrice) / 2;

function formatToday(lang: Lang): string {
  const locale = lang === "zh" ? "zh-CN" : "en-US";
  return new Date().toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

function formatDateTime(date: Date, lang: Lang): string {
  const locale = lang === "zh" ? "zh-CN" : "en-US";
  return date.toLocaleString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function parseContextToTokens(ctx: string): number {
  const match = ctx.match(/^([\d.]+)(K|M)$/i);
  if (!match) return 0;
  const num = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  return unit === "M" ? num * 1_000_000 : num * 1_000;
}

function calcTrend(oldPrice: number, newPrice: number): {
  trend: PriceTrend;
  pct: number;
} {
  if (oldPrice === 0) return { trend: "flat", pct: 0 };
  const pct = Math.round(((newPrice - oldPrice) / oldPrice) * 100);
  if (pct < 0) return { trend: "down", pct: Math.abs(pct) };
  if (pct > 0) return { trend: "up", pct };
  return { trend: "flat", pct: 0 };
}

function jitterPrice(price: number): number {
  const factor = 1 + (Math.random() * 0.1 - 0.05);
  return Math.max(0.001, price * factor);
}

function seedInitialTrends(model: Model): LiveModel {
  const inputJitter = jitterPrice(model.inputPrice);
  const outputJitter = jitterPrice(model.outputPrice);
  const inputTrend = calcTrend(model.inputPrice, inputJitter);
  const outputTrend = calcTrend(model.outputPrice, outputJitter);
  return {
    ...model,
    inputPrice: inputJitter,
    outputPrice: outputJitter,
    inputTrend: inputTrend.trend,
    outputTrend: outputTrend.trend,
    inputChangePct: inputTrend.pct,
    outputChangePct: outputTrend.pct,
  };
}

function matchesUseCaseFilter(model: Model, filter: UseCaseFilter): boolean {
  if (filter === "all") return true;
  const uc = model.useCase.toLowerCase();
  switch (filter) {
    case "coding":
      return uc.includes("coding") || uc.includes("编程") || model.useCase.includes("Coding");
    case "long-context":
      return uc.includes("长上下文") || parseContextToTokens(model.context) >= 200_000;
    case "value":
      return uc.includes("性价比");
    case "fast":
      return model.speed === "Very Fast" || model.speed === "Fast" || uc.includes("快速");
    default:
      return true;
  }
}

function monthlyCost(
  model: { inputPrice: number; outputPrice: number },
  millionTokens: number
): number {
  const half = millionTokens / 2;
  return half * model.inputPrice + half * model.outputPrice;
}

function PriceTrendBadge({ trend, pct }: { trend: PriceTrend; pct: number }) {
  if (trend === "down") return <span className="ml-1 text-xs text-green-500 font-medium whitespace-nowrap">↓{pct}%</span>;
  if (trend === "up") return <span className="ml-1 text-xs text-red-500 font-medium whitespace-nowrap">↑{pct}%</span>;
  return <span className="ml-1 text-xs text-gray-500 font-medium whitespace-nowrap">-</span>;
}

function formatPrice(price: number): string {
  if (price < 1) return price.toFixed(3);
  return price.toFixed(2);
}

function getUseCaseEn(modelName: string): string {
  const map: Record<string, string> = {
    "GPT-4o": "General/Coding", "GPT-4o mini": "Light tasks", "GPT-4.5": "Complex reasoning",
    "GPT-5": "Flagship general", "GPT-4 Turbo": "High precision tasks", "o1-preview": "Deep reasoning",
    "o1-mini": "Fast reasoning", "Claude 3.5 Sonnet": "Complex tasks/Coding", "Claude 3.7 Sonnet": "Coding/Complex tasks",
    "Claude 3 Opus": "High-difficulty tasks", "Claude 3 Haiku": "Fast & low cost", "Gemini 1.5 Pro": "Long context",
    "Gemini 1.5 Flash": "Fast response", "Gemini 2.5 Pro": "Multimodal/Long context", "Gemini 1.0 Pro": "Basic tasks",
    "DeepSeek V3": "Best value", "DeepSeek V4": "Next-gen value", "DeepSeek V2.5": "Balanced", "DeepSeek R1": "Reasoning tasks",
    "GLM-4": "Chinese optimized", "GLM-4-Plus": "Complex Chinese", "Qwen-Max": "Multi-task", "Qwen-Plus": "Best value",
    "ERNIE 4.0": "Chinese understanding", "ERNIE-3.5": "Lightweight Chinese", "Yi-34B": "Open source Chinese",
    "Llama 4": "Open source flagship", "Llama 3.3 70B": "Real-time apps", "Llama 3.1 405B": "Giant model",
    "Mixtral 8x22B": "Open source choice", "Mistral Large": "Top open source", "Mistral Small": "Lightweight",
    "Codestral": "Code specialized", "Groq (Llama 3.3 70B)": "Fastest inference", "Fireworks AI": "High speed inference",
    "Cerebras": "Dedicated hardware", "SambaNova": "Efficient inference", "Command R+": "RAG apps", "Command-R": "RAG specialized",
    "Jamba-1.5": "Long context", "DALL-E 3": "High quality image", "DALL-E 2": "Fast image", "Stable Diffusion 3": "Open source image",
    "SDXL": "Basic image", "Flux Pro": "High realism", "Midjourney": "Artistic style", "text-embedding-3-small": "General embedding",
    "text-embedding-3-large": "High precision embedding", "voyage-2": "RAG optimized", "cohere-embed-v3": "Multilingual embedding",
    "Whisper": "Speech to text", "TTS HD": "High quality voice", "ElevenLabs": "Natural voice",
  };
  return map[modelName] || modelName;
}

function getProviderEn(provider: string): string {
  const map: Record<string, string> = {
    "智谱AI": "Zhipu AI", "阿里": "Alibaba", "百度": "Baidu", "零一万物": "01.AI",
    "OpenAI": "OpenAI", "Anthropic": "Anthropic", "Google": "Google", "DeepSeek": "DeepSeek",
    "Meta": "Meta", "Mistral": "Mistral", "Cohere": "Cohere", "AI21": "AI21",
    "Groq": "Groq", "Together AI": "Together AI", "Fireworks": "Fireworks", "Cerebras": "Cerebras",
    "SambaNova": "SambaNova", "Stability AI": "Stability AI", "Flux": "Flux", "Midjourney": "Midjourney",
    "Voyage AI": "Voyage AI", "ElevenLabs": "ElevenLabs",
  };
  return map[provider] || provider;
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("zh");
  const [recommendType, setRecommendType] = useState<RecommendType>("coding");
  const [budget, setBudget] = useState<number>(50);
  const [isDark, setIsDark] = useState(true);
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [liveModels, setLiveModels] = useState<LiveModel[]>(() =>
    baseModels.map(seedInitialTrends)
  );
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [useCaseFilter, setUseCaseFilter] = useState<UseCaseFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<ModelCategory>("all");
  const [monthlyUsageM, setMonthlyUsageM] = useState<string>("10");

  const t = translations[lang];
  const updateDate = formatToday(lang);

  const copyModelName = useCallback(async (name: string) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopiedName(name);
      setTimeout(() => setCopiedName(null), 2000);
    } catch { /* clipboard unavailable */ }
  }, []);

  const refreshSimulatedPrices = useCallback(() => {
    setLiveModels((prev) =>
      prev.map((model) => {
        const newInput = jitterPrice(model.inputPrice);
        const newOutput = jitterPrice(model.outputPrice);
        const inputTrend = calcTrend(model.inputPrice, newInput);
        const outputTrend = calcTrend(model.outputPrice, newOutput);
        return {
          ...model,
          inputPrice: newInput,
          outputPrice: newOutput,
          inputTrend: inputTrend.trend,
          outputTrend: outputTrend.trend,
          inputChangePct: inputTrend.pct,
          outputChangePct: outputTrend.pct,
        };
      })
    );
    setLastRefresh(new Date());
  }, []);

  const filteredModels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return liveModels.filter((model) => {
      if (categoryFilter !== "all" && model.category !== categoryFilter) return false;
      if (!matchesUseCaseFilter(model, useCaseFilter)) return false;
      if (!q) return true;
      return model.name.toLowerCase().includes(q) ||
        model.provider.toLowerCase().includes(q) ||
        model.useCase.toLowerCase().includes(q);
    });
  }, [liveModels, searchQuery, useCaseFilter, categoryFilter]);

  const usageM = parseFloat(monthlyUsageM) || 0;
  const costRankings = useMemo(() => {
    if (usageM <= 0) return [];
    return liveModels.map((model) => ({
      name: model.name,
      provider: model.provider,
      cost: monthlyCost(model, usageM),
    })).sort((a, b) => a.cost - b.cost);
  }, [liveModels, usageM]);
  const top3Cheapest = costRankings.slice(0, 3);

  const theme = isDark ? {
    page: "bg-black text-white", header: "border-gray-800", subtitle: "text-gray-400",
    card: "bg-gray-900 border-gray-800", cardLabel: "text-gray-400",
    table: "bg-gray-900 border-gray-800", thead: "bg-gray-800 border-gray-700 text-gray-300",
    row: "border-gray-800 hover:bg-gray-800", cell: "text-gray-300",
    updateBanner: "bg-blue-500/10 border-blue-500/30 text-blue-300",
    btn: "bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700",
    btnPrimary: "bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-700",
    footer: "text-gray-500", toggle: "bg-gray-800 hover:bg-gray-700 text-yellow-400",
    langToggle: "bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-700",
    input: "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-blue-500",
    select: "bg-gray-800 border-gray-700 text-white focus:ring-blue-500",
    calcSection: "bg-gray-900 border-gray-800", calcHighlight: "bg-green-500/10 border-green-500/30",
    refreshBtn: "bg-blue-600 hover:bg-blue-500 text-white border-blue-500",
    muted: "text-gray-500",
  } : {
    page: "bg-gray-50 text-gray-900", header: "border-gray-200", subtitle: "text-gray-500",
    card: "bg-white border-gray-200 shadow-sm", cardLabel: "text-gray-500",
    table: "bg-white border-gray-200 shadow-sm", thead: "bg-gray-100 border-gray-200 text-gray-600",
    row: "border-gray-100 hover:bg-gray-50", cell: "text-gray-600",
    updateBanner: "bg-blue-50 border-blue-200 text-blue-700",
    btn: "bg-gray-100 hover:bg-gray-200 text-gray-600 border-gray-200",
    btnPrimary: "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200",
    footer: "text-gray-400", toggle: "bg-gray-100 hover:bg-gray-200 text-amber-500",
    langToggle: "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200",
    input: "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500",
    select: "bg-white border-gray-300 text-gray-900 focus:ring-blue-500",
    calcSection: "bg-white border-gray-200 shadow-sm", calcHighlight: "bg-green-50 border-green-200",
    refreshBtn: "bg-blue-600 hover:bg-blue-700 text-white border-blue-600",
    muted: "text-gray-400",
  };

  const minInput = Math.min(...liveModels.map((m) => m.inputPrice));

  // 根据场景和预算获取推荐
  const getRecommendations = () => {
    if (recommendType === "coding") {
      return {
        best: { name: "Claude 3.7 Sonnet", provider: "Anthropic", cost: "$3.00", reason: t.reasonCoding },
        value: { name: "DeepSeek V3", provider: "DeepSeek", cost: "$0.21", reason: t.reasonValue },
        fast: { name: "Gemini 1.5 Flash", provider: "Google", cost: "$0.19", reason: t.reasonFast },
      };
    } else if (recommendType === "writing") {
      return {
        best: { name: "GPT-4o", provider: "OpenAI", cost: "$2.50", reason: "📝 写作能力均衡，创意丰富" },
        value: { name: "Claude 3 Haiku", provider: "Anthropic", cost: "$0.25", reason: "💰 成本低，适合大量写作" },
        fast: { name: "Gemini 1.5 Flash", provider: "Google", cost: "$0.19", reason: "⚡ 快速生成，适合实时写作" },
      };
    } else if (recommendType === "agent") {
      return {
        best: { name: "GPT-4o", provider: "OpenAI", cost: "$2.50", reason: "🤖 函数调用最强，适合 Agent" },
        value: { name: "DeepSeek V3", provider: "DeepSeek", cost: "$0.21", reason: "💰 成本低，适合大规模 Agent" },
        fast: { name: "Groq (Llama 3.3 70B)", provider: "Groq", cost: "$0.70", reason: "⚡ 延迟最低，适合实时 Agent" },
      };
    } else {
      return {
        best: { name: "Gemini 1.5 Flash", provider: "Google", cost: "$0.19", reason: "⚡ 延迟最低，实时对话最佳" },
        value: { name: "GPT-4o mini", provider: "OpenAI", cost: "$0.15", reason: "💰 成本低，响应快" },
        fast: { name: "Claude 3 Haiku", provider: "Anthropic", cost: "$0.25", reason: "⚡ 高速响应，适合聊天" },
      };
    }
  };

  const recs = getRecommendations();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme.page}`}>
      <header className={`border-b ${theme.header}`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Inferly</h1>
              <p className="text-xl mt-2 text-gray-300 max-w-2xl">{lang === "zh" ? "瞬间找到最便宜的AI模型" : "Find the cheapest AI model instantly."}</p>
              <p className="text-md mt-1 text-gray-400">{lang === "zh" ? "对比顶级AI提供商的价格、速度和性能" : "Compare pricing, speed, and performance across top AI providers."}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setLang((l) => (l === "zh" ? "en" : "zh"))} className={`px-3 h-10 rounded-lg border text-sm font-medium transition-colors ${theme.langToggle}`}>{lang === "zh" ? "English" : "中文"}</button>
              <button onClick={() => setIsDark((d) => !d)} className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ${theme.toggle}`}>{isDark ? <Sun size={20} /> : <Moon size={20} />}</button>
            </div>
          </div>
          <div className={`mt-4 px-4 py-2.5 rounded-lg border text-sm ${theme.updateBanner}`}>{t.updateBannerPrefix}{updateDate}{t.updateBannerSuffix}</div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button onClick={refreshSimulatedPrices} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition ${theme.refreshBtn}`}><RefreshCw size={16} />{t.refreshPrices}</button>
            <span className={`text-sm ${theme.muted}`}>{t.lastRefresh}{lastRefresh ? formatDateTime(lastRefresh, lang) : t.notRefreshed}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`rounded-lg p-4 border ${theme.card}`}><div className={`text-sm ${theme.cardLabel}`}>{t.statTotalModels}</div><div className="text-2xl font-bold">{liveModels.length}</div></div>
          <div className={`rounded-lg p-4 border ${theme.card}`}><div className={`text-sm ${theme.cardLabel}`}>{t.statCheapestInput}</div><div className="text-2xl font-bold text-green-500">${formatPrice(minInput)}/M</div></div>
          <div className={`rounded-lg p-4 border ${theme.card}`}><div className={`text-sm ${theme.cardLabel}`}>{t.statFastest}</div><div className="text-2xl font-bold text-blue-500">Groq</div></div>
          <div className={`rounded-lg p-4 border ${theme.card}`}><div className={`text-sm ${theme.cardLabel}`}>{t.statLongestContext}</div><div className="text-2xl font-bold text-purple-500">2M</div></div>
        </div>

        {/* AI 推荐引擎 */}
        <div className={`rounded-xl border p-6 mb-8 ${theme.calcSection}`}>
          <h2 className="text-xl font-semibold mb-2 text-center">{t.recommendTitle}</h2>
          <p className={`text-sm text-center mb-6 ${theme.muted}`}>{t.recommendDesc}</p>

          {/* 场景按钮 */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {(["coding", "writing", "agent", "fast"] as RecommendType[]).map((type) => (
              <button key={type} onClick={() => setRecommendType(type)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${recommendType === type ? "bg-blue-600 text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700"}`}>
                {type === "coding" && t.btnCoding}
                {type === "writing" && t.btnWriting}
                {type === "agent" && t.btnAgent}
                {type === "fast" && t.btnFast}
              </button>
            ))}
          </div>

          {/* 预算滑块 */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex justify-between mb-2"><span className={`text-sm ${theme.muted}`}>{t.monthlyBudget}</span><span className="text-sm font-semibold text-green-500">${budget}</span></div>
            <input type="range" min="0" max="1000" step="10" value={budget} onChange={(e) => setBudget(parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
            <div className="flex justify-between text-xs text-gray-500 mt-1"><span>$0</span><span>$500</span><span>$1000</span></div>
          </div>

          {/* 推荐结果 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${theme.calcHighlight}`}>
              <div className="flex items-center gap-2 mb-2"><span className="text-2xl">🏆</span><span className="font-bold text-green-500">{t.bestPick}</span></div>
              <div className="text-lg font-semibold">{recs.best.name}</div>
              <div className={`text-sm ${theme.muted}`}>{recs.best.provider}</div>
              <div className="text-xs text-gray-400 mt-2">{recs.best.reason}</div>
              <div className="text-sm font-bold text-green-500 mt-2">~{recs.best.cost} / 1M token</div>
              <a href="https://runpod.io?ref=69zpi5j4" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition w-full text-center">🚀 通过 Inferly 使用</a>
            </div>
            <div className={`p-4 rounded-lg border ${theme.calcHighlight}`}>
              <div className="flex items-center gap-2 mb-2"><span className="text-2xl">🥈</span><span className="font-bold text-blue-500">{t.valuePick}</span></div>
              <div className="text-lg font-semibold">{recs.value.name}</div>
              <div className={`text-sm ${theme.muted}`}>{recs.value.provider}</div>
              <div className="text-xs text-gray-400 mt-2">{recs.value.reason}</div>
              <div className="text-sm font-bold text-green-500 mt-2">~{recs.value.cost} / 1M token</div>
              <a href="https://runpod.io?ref=69zpi5j4" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition w-full text-center">🚀 通过 Inferly 使用</a>
            </div>
            <div className={`p-4 rounded-lg border ${theme.calcHighlight}`}>
              <div className="flex items-center gap-2 mb-2"><span className="text-2xl">⚡</span><span className="font-bold text-purple-500">{t.fastestPick}</span></div>
              <div className="text-lg font-semibold">{recs.fast.name}</div>
              <div className={`text-sm ${theme.muted}`}>{recs.fast.provider}</div>
              <div className="text-xs text-gray-400 mt-2">{recs.fast.reason}</div>
              <div className="text-sm font-bold text-green-500 mt-2">~{recs.fast.cost} / 1M token</div>
              <a href="https://runpod.io?ref=69zpi5j4" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition w-full text-center">🚀 通过 Inferly 使用</a>
            </div>
          </div>
          <p className={`text-center text-xs ${theme.muted} mt-4`}>💡 {t.clickHint}</p>
        </div>

        {/* Why Use Us */}
        <div className={`rounded-xl border p-6 mb-8 ${theme.calcSection}`}>
          <h2 className="text-xl font-semibold mb-6 text-center">{lang === "zh" ? "为什么选择 Inferly？" : "Why Inferly?"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3"><div className="text-2xl mb-2">💰</div><div className="font-bold text-green-500">{lang === "zh" ? "节省AI成本" : "Save AI costs"}</div><div className={`text-xs mt-1 ${theme.muted}`}>{lang === "zh" ? "跨提供商对比价格" : "Compare prices across providers"}</div></div>
            <div className="text-center p-3"><div className="text-2xl mb-2">⚡</div><div className="font-bold text-blue-500">{lang === "zh" ? "即时对比模型" : "Compare models instantly"}</div><div className={`text-xs mt-1 ${theme.muted}`}>{lang === "zh" ? "并排表格视图" : "Side-by-side table view"}</div></div>
            <div className="text-center p-3"><div className="text-2xl mb-2">🎯</div><div className="font-bold text-purple-500">{lang === "zh" ? "找到最佳提供商" : "Find the best provider"}</div><div className={`text-xs mt-1 ${theme.muted}`}>{lang === "zh" ? "OpenAI, Anthropic, Google 等" : "OpenAI, Anthropic, Google & more"}</div></div>
            <div className="text-center p-3"><div className="text-2xl mb-2">📊</div><div className="font-bold text-orange-500">{lang === "zh" ? "实时洞察" : "Real-time insights"}</div><div className={`text-xs mt-1 ${theme.muted}`}>{lang === "zh" ? "价格趋势与成本计算器" : "Price trends & cost calculator"}</div></div>
          </div>
        </div>

        {/* 成本计算器 */}
        <div className={`rounded-xl border p-6 mb-8 ${theme.calcSection}`}>
          <div className="flex items-center gap-2 mb-4"><Calculator size={20} className="text-blue-500" /><h2 className="text-lg font-semibold">{t.costCalculator}</h2></div>
          <div className="flex flex-wrap items-end gap-4 mb-6">
            <label className="flex flex-col gap-1.5"><span className={`text-sm ${theme.cardLabel}`}>{t.monthlyUsage}</span><input type="number" min="0" step="0.1" value={monthlyUsageM} onChange={(e) => setMonthlyUsageM(e.target.value)} className={`w-48 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${theme.input}`} placeholder={t.monthlyUsagePlaceholder} /></label>
            <p className={`text-sm ${theme.muted} pb-2`}>{t.costEstimateHint}</p>
          </div>
          {usageM > 0 && top3Cheapest.length > 0 && (<div className="mb-6"><h3 className={`text-sm font-medium mb-3 ${theme.cardLabel}`}>{t.cheapestTop3}</h3><div className="grid grid-cols-1 md:grid-cols-3 gap-3">{top3Cheapest.map((item, idx) => (<div key={item.name} className={`rounded-lg border p-4 ${theme.calcHighlight}`}><div className="flex items-center gap-2 mb-1"><span className="text-lg font-bold text-green-500">#{idx + 1}</span><span className="font-semibold">{item.name}</span></div><p className={`text-xs ${theme.muted}`}>{item.provider}</p><p className="text-xl font-bold text-green-500 mt-2">${item.cost.toFixed(2)}{t.perMonth}</p></div>))}</div></div>)}
          {usageM > 0 && (<div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className={`border-b ${theme.thead}`}><th className="text-left py-2 px-2">{t.calcModel}</th><th className="text-left py-2 px-2">{t.calcProvider}</th><th className="text-right py-2 px-2">{t.calcMonthlyCost}</th></tr></thead><tbody>{costRankings.map((item) => (<tr key={item.name} className={`border-b ${theme.row}`}><td className="py-2 px-2 font-medium">{item.name}</td><td className={`py-2 px-2 ${theme.cell}`}>{item.provider}</td><td className="py-2 px-2 text-right text-blue-500 font-medium">${item.cost.toFixed(2)}</td></tr>))}</tbody></table></div>)}
        </div>

        {/* 搜索筛选 */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1"><Search size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.muted}`} /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t.searchPlaceholder} className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 ${theme.input}`} /></div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as ModelCategory)} className={`sm:w-40 px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 ${theme.select}`}><option value="all">{t.categoryAll}</option><option value="text">{t.categoryText}</option><option value="image">{t.categoryImage}</option><option value="embedding">{t.categoryEmbedding}</option><option value="audio">{t.categoryAudio}</option></select>
          <select value={useCaseFilter} onChange={(e) => setUseCaseFilter(e.target.value as UseCaseFilter)} className={`sm:w-52 px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 ${theme.select}`} aria-label={t.filterAria}>{USE_CASE_FILTER_LABELS[lang].map((opt) => (<option key={opt.value} value={opt.value}>{t[opt.labelKey]}</option>))}</select>
        </div>
        <p className={`text-sm mb-3 ${theme.muted}`}>{t.showingModels(filteredModels.length, liveModels.length)}</p>

        {/* 表格 */}
        <div className={`rounded-xl border overflow-hidden ${theme.table}`}>
          <div className="overflow-x-auto"><table className="w-full"><thead className={`border-b ${theme.thead}`}><tr className="text-left text-sm"><th className="px-4 py-3">{t.thModel}</th><th className="px-4 py-3">{t.thProvider}</th><th className="px-4 py-3">{t.thInput}</th><th className="px-4 py-3">{t.thOutput}</th><th className="px-4 py-3">{t.thBlended}</th><th className="px-4 py-3">{t.thContext}</th><th className="px-4 py-3">{t.thSpeed}</th><th className="px-4 py-3">{t.thUseCase}</th><th className="px-4 py-3">{t.thActions}</th><th className="px-4 py-3">🚀 推广</th></tr></thead><tbody>{filteredModels.length === 0 ? (<tr><td colSpan={10} className={`px-4 py-8 text-center ${theme.muted}`}>{t.noResults}</td></tr>) : (filteredModels.map((model) => (<tr key={model.name} className={`border-b transition ${theme.row}`}><td className="px-4 py-3"><div className="flex items-center gap-2 flex-wrap"><span className="font-medium">{model.name}</span><button type="button" onClick={() => copyModelName(model.name)} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border transition ${theme.btn}`} title={t.copyTitle}>{copiedName === model.name ? (<><Check size={12} className="text-green-500" />{t.copied}</>) : (<><Copy size={12} />{t.copyName}</>)}</button></div></td><td className={`px-4 py-3 ${theme.cell}`}>{lang === "zh" ? model.provider : getProviderEn(model.provider)}</td><td className="px-4 py-3 text-green-500"><div className="inline-flex items-center flex-wrap"><span>${formatPrice(model.inputPrice)}</span><PriceTrendBadge trend={model.inputTrend} pct={model.inputChangePct} /></div></td><td className="px-4 py-3 text-yellow-500"><div className="inline-flex items-center flex-wrap"><span>${formatPrice(model.outputPrice)}</span><PriceTrendBadge trend={model.outputTrend} pct={model.outputChangePct} /></div></td><td className="px-4 py-3 text-blue-500">${formatPrice(getBlendedPrice(model))}</td><td className={`px-4 py-3 ${theme.cell}`}>{model.context}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${model.speed === "Very Fast" ? "bg-green-500/20 text-green-500" : model.speed === "Fast" ? "bg-blue-500/20 text-blue-500" : "bg-yellow-500/20 text-yellow-500"}`}>{model.speed}</span></td><td className={`px-4 py-3 ${theme.cell}`}>{lang === "zh" ? model.useCase : getUseCaseEn(model.name)}</td><td className="px-4 py-3"><a href={model.officialUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs border transition ${theme.btnPrimary}`}><ExternalLink size={12} />{t.officialSite}</a></td><td className="px-4 py-3"><a href="https://runpod.io?ref=69zpi5j4" target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs border transition ${theme.btnPrimary}`}>🚀 RunPod</a></td></tr>)))}</tbody></table></div>
        </div>

        <div className={`mt-6 text-center text-xs ${theme.footer}`}>{t.footerPriceUnit} · {t.footerUpdated}{updateDate}{lastRefresh && ` · ${t.footerSimRefresh}${formatDateTime(lastRefresh, lang)}`}</div>
      </main>
    </div>
  );
}
