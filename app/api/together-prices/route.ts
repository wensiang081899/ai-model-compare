import { NextRequest, NextResponse } from 'next/server';

// 模型价格表（每 1M tokens）
const MODEL_PRICES: Record<string, { input: number; output: number }> = {
  'deepseek/deepseek-chat': { input: 0.14, output: 0.28 },
  'openai/gpt-4o-mini': { input: 0.15, output: 0.60 },
  'openai/gpt-4o': { input: 2.50, output: 10.00 },
  'anthropic/claude-3-haiku': { input: 0.25, output: 1.25 },
  'anthropic/claude-3-sonnet': { input: 3.00, output: 15.00 },
  'google/gemini-flash-1.5': { input: 0.075, output: 0.30 },
};

// 用户定价（成本 × 倍数）
const MARKUP = 2.0; // 2倍定价，利润率 50%

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { messages, model = "deepseek/deepseek-chat" } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    // 获取模型价格
    const modelPrice = MODEL_PRICES[model] || MODEL_PRICES['deepseek/deepseek-chat'];
    
    // 调用 OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://ai-model-compare-eight.vercel.app',
        'X-Title': 'Inferly API',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'API call failed' }, { status: response.status });
    }

    // 计算成本
    const inputTokens = data.usage?.prompt_tokens || 0;
    const outputTokens = data.usage?.completion_tokens || 0;
    const inputCost = (inputTokens / 1_000_000) * modelPrice.input;
    const outputCost = (outputTokens / 1_000_000) * modelPrice.output;
    const ourCost = inputCost + outputCost;
    const userPrice = ourCost * MARKUP;

    // 返回结果 + 定价信息
    return NextResponse.json({
      id: data.id,
      model: data.model,
      choices: data.choices,
      usage: data.usage,
      inferly_pricing: {
        model_used: model,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        our_cost_cents: (ourCost * 100).toFixed(4),
        user_price_cents: (userPrice * 100).toFixed(4),
        markup_percentage: ((MARKUP - 1) * 100).toFixed(0),
        message: `You saved ${((MARKUP - 1) * 100).toFixed(0)}% vs direct API`
      }
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET 请求返回 API 信息
export async function GET() {
  return NextResponse.json({ 
    name: 'Inferly API',
    version: '1.0.0',
    description: 'Cost-optimized AI API access',
    base_url: 'https://ai-model-compare-eight.vercel.app/api/chat',
    method: 'POST',
    request_format: {
      messages: [{ role: 'user', content: 'your prompt' }],
      model: 'optional, defaults to deepseek/deepseek-chat'
    },
    supported_models: Object.keys(MODEL_PRICES),
    pricing: {
      markup: `${MARKUP}x`,
      example: 'Our cost $0.002 → You pay $0.004',
      profit_margin: `${((MARKUP - 1) * 100).toFixed(0)}%`
    }
  });
}
