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

type PriceTrend = "up" | "down" | "flat";

type LiveModel = Model & {
  inputTrend: PriceTrend;
  outputTrend: PriceTrend;
  inputChangePct: number;
  outputChangePct: number;
};

type UseCaseFilter =
  | "all"
  | "coding"
  | "long-context"
  | "value"
  | "fast";

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
      return (
        uc.includes("coding") ||
        uc.includes("编程") ||
        model.useCase.includes("Coding")
      );
    case "long-context":
      return (
        uc.includes("长上下文") ||
        parseContextToTokens(model.context) >= 200_000
      );
    case "value":
      return uc.includes("性价比");
    case "fast":
      return (
        model.speed === "Very Fast" ||
        model.speed === "Fast" ||
        uc.includes("快速")
      );
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

function PriceTrendBadge({
  trend,
  pct,
}: {
  trend: PriceTrend;
  pct: number;
}) {
  if (trend === "down") {
    return (
      <span className="ml-1 text-xs text-green-500 font-medium whitespace-nowrap">
        ↓{pct}%
      </span>
    );
  }
  if (trend === "up") {
    return (
      <span className="ml-1 text-xs text-red-500 font-medium whitespace-nowrap">
        ↑{pct}%
      </span>
    );
  }
  return (
    <span className="ml-1 text-xs text-gray-500 font-medium whitespace-nowrap">
      -
    </span>
  );
}

function formatPrice(price: number): string {
  if (price < 1) return price.toFixed(3);
  return price.toFixed(2);
}

// 获取英文用途
function getUseCaseEn(modelName: string): string {
  const map: Record<string, string> = {
    "GPT-4o": "General/Coding",
    "GPT-4o mini": "Light tasks",
    "GPT-4.5": "Complex reasoning",
    "GPT-5": "Flagship general",
    "Claude 3.5 Sonnet": "Complex tasks/Coding",
    "Claude 3.7 Sonnet": "Coding/Complex tasks",
    "Claude 3 Opus": "High-difficulty tasks",
    "Gemini 1.5 Pro": "Long context",
    "Gemini 1.5 Flash": "Fast response",
    "Gemini 2.5 Pro": "Multimodal/Long context",
    "DeepSeek V3": "Best value",
    "DeepSeek V4": "Next-gen value",
    "DeepSeek R1": "Reasoning tasks",
    "Llama 4": "Open source flagship",
    "Llama 3.3 70B": "Real-time apps",
    "Llama 3.1 405B": "Giant model",
    "Mixtral 8x22B": "Open source choice",
    "Command R+": "RAG apps",
  };
  return map[modelName] || modelName;
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("zh");
  const [recommendType, setRecommendType] = useState<string>("cheapest");
  const [isDark, setIsDark] = useState(true);
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [liveModels, setLiveModels] = useState<LiveModel[]>(() =>
    baseModels.map(seedInitialTrends)
  );
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [useCaseFilter, setUseCaseFilter] = useState<UseCaseFilter>("all");
  const [monthlyUsageM, setMonthlyUsageM] = useState<string>("10");

  const t = translations[lang];
  const updateDate = formatToday(lang);

  const copyModelName = useCallback(async (name: string) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopiedName(name);
      setTimeout(() => setCopiedName(null), 2000);
    } catch {
      /* clipboard unavailable */
    }
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
      if (!matchesUseCaseFilter(model, useCaseFilter)) return false;
      if (!q) return true;
      return (
        model.name.toLowerCase().includes(q) ||
        model.provider.toLowerCase().includes(q) ||
        model.useCase.toLowerCase().includes(q)
      );
    });
  }, [liveModels, searchQuery, useCaseFilter]);

  const usageM = parseFloat(monthlyUsageM) || 0;

  const costRankings = useMemo(() => {
    if (usageM <= 0) return [];
    return liveModels
      .map((model) => ({
        name: model.name,
        provider: model.provider,
        cost: monthlyCost(model, usageM),
      }))
      .sort((a, b) => a.cost - b.cost);
  }, [liveModels, usageM]);

  const top3Cheapest = costRankings.slice(0, 3);

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
        btnPrimary:
          "bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-700",
        footer: "text-gray-500",
        toggle: "bg-gray-800 hover:bg-gray-700 text-yellow-400",
        langToggle: "bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-700",
        input:
          "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-blue-500",
        select: "bg-gray-800 border-gray-700 text-white focus:ring-blue-500",
        calcSection: "bg-gray-900 border-gray-800",
        calcHighlight: "bg-green-500/10 border-green-500/30",
        refreshBtn:
          "bg-blue-600 hover:bg-blue-500 text-white border-blue-500",
        muted: "text-gray-500",
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
        btnPrimary:
          "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200",
        footer: "text-gray-400",
        toggle: "bg-gray-100 hover:bg-gray-200 text-amber-500",
        langToggle: "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200",
        input:
          "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500",
        select: "bg-white border-gray-300 text-gray-900 focus:ring-blue-500",
        calcSection: "bg-white border-gray-200 shadow-sm",
        calcHighlight: "bg-green-50 border-green-200",
        refreshBtn:
          "bg-blue-600 hover:bg-blue-700 text-white border-blue-600",
        muted: "text-gray-400",
      };

  const minInput = Math.min(...liveModels.map((m) => m.inputPrice));

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme.page}`}>
      <header className={`border-b ${theme.header}`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-display">
                Inferly
              </h1>
              <p className="text-xl mt-2 text-gray-300 max-w-2xl">
                {lang === "zh" ? "瞬间找到最便宜的AI模型" : "Find the cheapest AI model instantly."}
              </p>
              <p className="text-md mt-1 text-gray-400">
                {lang === "zh" ? "对比顶级AI提供商的价格、速度和性能" : "Compare pricing, speed, and performance across top AI providers."}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setLang((l) => (l === "zh" ? "en" : "zh"))}
                className={`px-3 h-10 rounded-lg border text-sm font-medium transition-colors ${theme.langToggle}`}
                aria-label={lang === "zh" ? t.switchToEn : t.switchToZh}
              >
                {lang === "zh" ? "English" : "中文"}
              </button>
              <button
                type="button"
                onClick={() => setIsDark((d) => !d)}
                className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ${theme.toggle}`}
                aria-label={isDark ? t.switchToLight : t.switchToDark}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>

          <div
            className={`mt-4 px-4 py-2.5 rounded-lg border text-sm ${theme.updateBanner}`}
          >
            {t.updateBannerPrefix}
            {updateDate}
            {t.updateBannerSuffix}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={refreshSimulatedPrices}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition ${theme.refreshBtn}`}
            >
              <RefreshCw size={16} />
              {t.refreshPrices}
            </button>
            <span className={`text-sm ${theme.muted}`}>
              {t.lastRefresh}
              {lastRefresh
                ? formatDateTime(lastRefresh, lang)
                : t.notRefreshed}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`rounded-lg p-4 border ${theme.card}`}>
            <div className={`text-sm ${theme.cardLabel}`}>
              {t.statTotalModels}
            </div>
            <div className="text-2xl font-bold">{liveModels.length}</div>
          </div>
          <div className={`rounded-lg p-4 border ${theme.card}`}>
            <div className={`text-sm ${theme.cardLabel}`}>
              {t.statCheapestInput}
            </div>
            <div className="text-2xl font-bold text-green-500">
              ${formatPrice(minInput)}/M
            </div>
          </div>
          <div className={`rounded-lg p-4 border ${theme.card}`}>
            <div className={`text-sm ${theme.cardLabel}`}>{t.statFastest}</div>
            <div className="text-2xl font-bold text-blue-500">Groq</div>
          </div>
          <div className={`rounded-lg p-4 border ${theme.card}`}>
            <div className={`text-sm ${theme.cardLabel}`}>
              {t.statLongestContext}
            </div>
            <div className="text-2xl font-bold text-purple-500">2M</div>
          </div>
        </div>

        {/* Why Use Us 区块 */}
        <div className={`rounded-xl border p-6 mb-8 ${theme.calcSection}`}>
          <h2 className="text-xl font-semibold mb-6 text-center">
            {lang === "zh" ? "为什么选择 Inferly？" : "Why Inferly?"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3">
              <div className="text-2xl mb-2">💰</div>
              <div className="font-bold text-green-500">
                {lang === "zh" ? "节省AI成本" : "Save AI costs"}
              </div>
              <div className={`text-xs mt-1 ${theme.muted}`}>
                {lang === "zh" ? "跨提供商对比价格" : "Compare prices across providers"}
              </div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-bold text-blue-500">
                {lang === "zh" ? "即时对比模型" : "Compare models instantly"}
              </div>
              <div className={`text-xs mt-1 ${theme.muted}`}>
                {lang === "zh" ? "并排表格视图" : "Side-by-side table view"}
              </div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-bold text-purple-500">
                {lang === "zh" ? "找到最佳提供商" : "Find the best provider"}
              </div>
              <div className={`text-xs mt-1 ${theme.muted}`}>
                {lang === "zh" ? "OpenAI, Anthropic, Google 等" : "OpenAI, Anthropic, Google & more"}
              </div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-bold text-orange-500">
                {lang === "zh" ? "实时洞察" : "Real-time insights"}
              </div>
              <div className={`text-xs mt-1 ${theme.muted}`}>
                {lang === "zh" ? "价格趋势与成本计算器" : "Price trends & cost calculator"}
              </div>
            </div>
          </div>
        </div>

        {/* 智能推荐引擎 */}
        <div className={`rounded-xl border p-6 mb-8 ${theme.calcSection}`}>
          <h2 className="text-xl font-semibold mb-4 text-center">
            🤖 {lang === "zh" ? "根据你的需求，智能推荐" : "Smart Recommendations Based on Your Needs"}
          </h2>
          <p className={`text-sm text-center mb-6 ${theme.muted}`}>
            {lang === "zh" ? "选择你的首要需求，我们帮你找到最合适的模型" : "Select your priority, we'll find the best model for you"}
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setRecommendType("cheapest")}
              className={`px-4 py-2 rounded-full transition text-sm font-medium ${
                recommendType === "cheapest"
                  ? "bg-green-500 text-white"
                  : "bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20"
              }`}
            >
              💰 {lang === "zh" ? "最便宜" : "Cheapest"}
            </button>
            <button
              onClick={() => setRecommendType("fastest")}
              className={`px-4 py-2 rounded-full transition text-sm font-medium ${
                recommendType === "fastest"
                  ? "bg-blue-500 text-white"
                  : "bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20"
              }`}
            >
              ⚡ {lang === "zh" ? "最快速度" : "Fastest"}
            </button>
            <button
              onClick={() => setRecommendType("coding")}
              className={`px-4 py-2 rounded-full transition text-sm font-medium ${
                recommendType === "coding"
                  ? "bg-purple-500 text-white"
                  : "bg-purple-500/10 text-purple-500 border border-purple-500/20 hover:bg-purple-500/20"
              }`}
            >
              🧠 {lang === "zh" ? "最佳编程" : "Best Coding"}
            </button>
            <button
              onClick={() => setRecommendType("context")}
              className={`px-4 py-2 rounded-full transition text-sm font-medium ${
                recommendType === "context"
                  ? "bg-orange-500 text-white"
                  : "bg-orange-500/10 text-orange-500 border border-orange-500/20 hover:bg-orange-500/20"
              }`}
            >
              📚 {lang === "zh" ? "最长上下文" : "Longest Context"}
            </button>
          </div>

          {/* 动态推荐卡片 */}
          {recommendType === "cheapest" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🏆</span>
                  <span className="font-bold text-green-500">
                    {lang === "zh" ? "🏆 首选：最便宜" : "🏆 Top Pick: Cheapest"}
                  </span>
                </div>
                <div className="text-xl font-semibold">Gemini 1.5 Flash</div>
                <div className={`text-sm ${theme.muted}`}>Google</div>
                <div className="mt-2 flex gap-3 text-sm">
                  <span className="text-green-500">{lang === "zh" ? "输入" : "Input"}: $0.075/M</span>
                  <span className="text-yellow-500">{lang === "zh" ? "输出" : "Output"}: $0.30/M</span>
                </div>
                <div className={`text-xs mt-2 ${theme.muted}`}>
                  {lang === "zh" ? "💰 性价比之王，适合大规模、成本敏感的应用" : "💰 Best value for large-scale, cost-sensitive applications"}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🥈</span>
                  <span className="font-bold text-blue-500">
                    {lang === "zh" ? "亚军" : "Runner Up"}
                  </span>
                </div>
                <div className="text-xl font-semibold">DeepSeek V3</div>
                <div className={`text-sm ${theme.muted}`}>DeepSeek</div>
                <div className="mt-2 flex gap-3 text-sm">
                  <span className="text-green-500">{lang === "zh" ? "输入" : "Input"}: $0.14/M</span>
                  <span className="text-yellow-500">{lang === "zh" ? "输出" : "Output"}: $0.28/M</span>
                </div>
                <div className={`text-xs mt-2 ${theme.muted}`}>
                  {lang === "zh" ? "📈 极低的输入成本，强大的通用能力" : "📈 Ultra-low input cost, strong general capability"}
                </div>
              </div>
            </div>
          )}

          {recommendType === "fastest" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🏆</span>
                  <span className="font-bold text-blue-500">
                    {lang === "zh" ? "🏆 首选：最快速度" : "🏆 Top Pick: Fastest"}
                  </span>
                </div>
                <div className="text-xl font-semibold">Groq (Llama 3.3 70B)</div>
                <div className={`text-sm ${theme.muted}`}>Groq</div>
                <div className="mt-2 flex gap-3 text-sm">
                  <span className="text-green-500">{lang === "zh" ? "输入" : "Input"}: $0.70/M</span>
                  <span className="text-yellow-500">{lang === "zh" ? "输出" : "Output"}: $0.80/M</span>
                </div>
                <div className={`text-xs mt-2 ${theme.muted}`}>
                  {lang === "zh" ? "⚡ 专门的推理加速硬件，极低延迟" : "⚡ Dedicated inference acceleration hardware, ultra-low latency"}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🥈</span>
                  <span className="font-bold text-green-500">
                    {lang === "zh" ? "性价比之选" : "Value Pick"}
                  </span>
                </div>
                <div className="text-xl font-semibold">Gemini 1.5 Flash</div>
                <div className={`text-sm ${theme.muted}`}>Google</div>
                <div className="mt-2 flex gap-3 text-sm">
                  <span className="text-green-500">{lang === "zh" ? "输入" : "Input"}: $0.075/M</span>
                  <span className="text-yellow-500">{lang === "zh" ? "输出" : "Output"}: $0.30/M</span>
                </div>
                <div className={`text-xs mt-2 ${theme.muted}`}>
                  {lang === "zh" ? "⚡ 快速响应 + 极低成本，最佳平衡" : "⚡ Fast response + ultra-low cost, best balance"}
                </div>
              </div>
            </div>
          )}

          {recommendType === "coding" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🏆</span>
                  <span className="font-bold text-purple-500">
                    {lang === "zh" ? "🏆 首选：最佳编程" : "🏆 Top Pick: Best Coding"}
                  </span>
                </div>
                <div className="text-xl font-semibold">Claude 3.7 Sonnet</div>
                <div className={`text-sm ${theme.muted}`}>Anthropic</div>
                <div className="mt-2 flex gap-3 text-sm">
                  <span className="text-green-500">{lang === "zh" ? "输入" : "Input"}: $3.00/M</span>
                  <span className="text-yellow-500">{lang === "zh" ? "输出" : "Output"}: $15.00/M</span>
                </div>
                <div className={`text-xs mt-2 ${theme.muted}`}>
                  {lang === "zh" ? "🧠 公认最强的代码生成和理解能力" : "🧠 Recognized as the strongest code generation and understanding"}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🥈</span>
                  <span className="font-bold text-blue-500">
                    {lang === "zh" ? "全能选手" : "All-Rounder"}
                  </span>
                </div>
                <div className="text-xl font-semibold">GPT-4o</div>
                <div className={`text-sm ${theme.muted}`}>OpenAI</div>
                <div className="mt-2 flex gap-3 text-sm">
                  <span className="text-green-500">{lang === "zh" ? "输入" : "Input"}: $2.50/M</span>
                  <span className="text-yellow-500">{lang === "zh" ? "输出" : "Output"}: $10.00/M</span>
                </div>
                <div className={`text-xs mt-2 ${theme.muted}`}>
                  {lang === "zh" ? "💻 强大的编程能力 + 多模态支持" : "💻 Strong coding ability + multimodal support"}
                </div>
              </div>
            </div>
          )}

          {recommendType === "context" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🏆</span>
                  <span className="font-bold text-orange-500">
                    {lang === "zh" ? "🏆 首选：最长上下文" : "🏆 Top Pick: Longest Context"}
                  </span>
                </div>
                <div className="text-xl font-semibold">Gemini 1.5 Pro</div>
                <div className={`text-sm ${theme.muted}`}>Google</div>
                <div className="mt-2 flex gap-3 text-sm">
                  <span className="text-green-500">{lang === "zh" ? "输入" : "Input"}: $1.25/M</span>
                  <span className="text-yellow-500">{lang === "zh" ? "输出" : "Output"}: $5.00/M</span>
                </div>
                <div className={`text-xs mt-2 ${theme.muted}`}>
                  {lang === "zh" ? "📚 200万 Token 上下文，可处理整本书" : "📚 2M token context, can process entire books"}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🥈</span>
                  <span className="font-bold text-purple-500">
                    {lang === "zh" ? "多模态之选" : "Multimodal Pick"}
                  </span>
                </div>
                <div className="text-xl font-semibold">Gemini 2.5 Pro</div>
                <div className={`text-sm ${theme.muted}`}>Google</div>
                <div className="mt-2 flex gap-3 text-sm">
                  <span className="text-green-500">{lang === "zh" ? "输入" : "Input"}: $1.25/M</span>
                  <span className="text-yellow-500">{lang === "zh" ? "输出" : "Output"}: $10.00/M</span>
                </div>
                <div className={`text-xs mt-2 ${theme.muted}`}>
                  {lang === "zh" ? "🎯 100万 Token + 多模态理解" : "🎯 1M token context + multimodal understanding"}
                </div>
              </div>
            </div>
          )}

          <p className={`text-center text-xs ${theme.muted} mt-6`}>
            💡 {lang === "zh" ? "点击上方按钮，推荐内容会动态变化" : "Click the buttons above to see dynamic recommendations"}
          </p>
        </div>

        <div className={`rounded-xl border p-6 mb-8 ${theme.calcSection}`}>
          <div className="flex items-center gap-2 mb-4">
            <Calculator size={20} className="text-blue-500" />
            <h2 className="text-lg font-semibold">{t.costCalculator}</h2>
          </div>
          <div className="flex flex-wrap items-end gap-4 mb-6">
            <label className="flex flex-col gap-1.5">
              <span className={`text-sm ${theme.cardLabel}`}>
                {t.monthlyUsage}
              </span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={monthlyUsageM}
                onChange={(e) => setMonthlyUsageM(e.target.value)}
                className={`w-48 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 ${theme.input}`}
                placeholder={t.monthlyUsagePlaceholder}
              />
            </label>
            <p className={`text-sm ${theme.muted} pb-2`}>{t.costEstimateHint}</p>
          </div>

          {usageM > 0 && top3Cheapest.length > 0 && (
            <div className="mb-6">
              <h3 className={`text-sm font-medium mb-3 ${theme.cardLabel}`}>
                {t.cheapestTop3}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {top3Cheapest.map((item, idx) => (
                  <div
                    key={item.name}
                    className={`rounded-lg border p-4 ${theme.calcHighlight}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold text-green-500">
                        #{idx + 1}
                      </span>
                      <span className="font-semibold">{item.name}</span>
                    </div>
                    <p className={`text-xs ${theme.muted}`}>{item.provider}</p>
                    <p className="text-xl font-bold text-green-500 mt-2">
                      ${item.cost.toFixed(2)}
                      {t.perMonth}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {usageM > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${theme.thead}`}>
                    <th className="text-left py-2 px-2">{t.calcModel}</th>
                    <th className="text-left py-2 px-2">{t.calcProvider}</th>
                    <th className="text-right py-2 px-2">
                      {t.calcMonthlyCost}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {costRankings.map((item) => (
                    <tr key={item.name} className={`border-b ${theme.row}`}>
                      <td className="py-2 px-2 font-medium">{item.name}</td>
                      <td className={`py-2 px-2 ${theme.cell}`}>
                        {item.provider}
                      </td>
                      <td className="py-2 px-2 text-right text-blue-500 font-medium">
                        ${item.cost.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.muted}`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 ${theme.input}`}
            />
          </div>
          <select
            value={useCaseFilter}
            onChange={(e) =>
              setUseCaseFilter(e.target.value as UseCaseFilter)
            }
            className={`sm:w-52 px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 ${theme.select}`}
            aria-label={t.filterAria}
          >
            {USE_CASE_FILTER_LABELS[lang].map((opt) => (
              <option key={opt.value} value={opt.value}>
                {t[opt.labelKey]}
              </option>
            ))}
          </select>
        </div>

        <p className={`text-sm mb-3 ${theme.muted}`}>
          {t.showingModels(filteredModels.length, liveModels.length)}
        </p>

        <div className={`rounded-xl border overflow-hidden ${theme.table}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`border-b ${theme.thead}`}>
                <tr className="text-left text-sm">
                  <th className="px-4 py-3">{t.thModel}</th>
                  <th className="px-4 py-3">{t.thProvider}</th>
                  <th className="px-4 py-3">{t.thInput}</th>
                  <th className="px-4 py-3">{t.thOutput}</th>
                  <th className="px-4 py-3">{t.thBlended}</th>
                  <th className="px-4 py-3">{t.thContext}</th>
                  <th className="px-4 py-3">{t.thSpeed}</th>
                  <th className="px-4 py-3">{t.thUseCase}</th>
                  <th className="px-4 py-3">{t.thActions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredModels.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className={`px-4 py-8 text-center ${theme.muted}`}
                    >
                      {t.noResults}
                    </td>
                  </tr>
                ) : (
                  filteredModels.map((model) => (
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
                            title={t.copyTitle}
                          >
                            {copiedName === model.name ? (
                              <>
                                <Check size={12} className="text-green-500" />
                                {t.copied}
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                {t.copyName}
                              </>
                            )}
                          </button>
                        </div>
                       </td>
                      <td className={`px-4 py-3 ${theme.cell}`}>
                        {model.provider}
                      </td>
                      <td className="px-4 py-3 text-green-500">
                        <div className="inline-flex items-center flex-wrap">
                          <span>${formatPrice(model.inputPrice)}</span>
                          <PriceTrendBadge
                            trend={model.inputTrend}
                            pct={model.inputChangePct}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-yellow-500">
                        <div className="inline-flex items-center flex-wrap">
                          <span>${formatPrice(model.outputPrice)}</span>
                          <PriceTrendBadge
                            trend={model.outputTrend}
                            pct={model.outputChangePct}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-blue-500">
                        ${formatPrice(getBlendedPrice(model))}
                      </td>
                      <td className={`px-4 py-3 ${theme.cell}`}>
                        {model.context}
                      </td>
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
                      <td className={`px-4 py-3 ${theme.cell}`}>
                        {lang === "zh" ? model.useCase : getUseCaseEn(model.name)}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={model.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs border transition ${theme.btnPrimary}`}
                        >
                          <ExternalLink size={12} />
                          {t.officialSite}
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`mt-6 text-center text-xs ${theme.footer}`}>
          {t.footerPriceUnit} · {t.footerUpdated}
          {updateDate}
          {lastRefresh &&
            ` · ${t.footerSimRefresh}${formatDateTime(lastRefresh, lang)}`}
        </div>
      </main>
    </div>
  );
}
