import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.TOGETHER_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const response = await fetch('https://api.together.xyz/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    
    const data = await response.json();
    
    // 临时：把所有模型名称打印出来，方便调试
    const modelNames: string[] = [];
    const prices: Record<string, { inputPrice: number; outputPrice: number }> = {};
    
    if (data.data) {
      for (const model of data.data) {
        modelNames.push(model.name);  // 收集所有模型名称
        const inputPrice = model.pricing?.input || 0;
        const outputPrice = model.pricing?.output || 0;
        
        // 使用更灵活的匹配规则
        const nameLower = model.name.toLowerCase();
        if (nameLower.includes('llama-3.3-70b')) {
          prices['Llama 3.3 70B'] = { inputPrice, outputPrice };
        } else if (nameLower.includes('deepseek-v3') || nameLower.includes('deepseek-v3')) {
          prices['DeepSeek V3'] = { inputPrice, outputPrice };
        } else if (nameLower.includes('mixtral-8x22b')) {
          prices['Mixtral 8x22B'] = { inputPrice, outputPrice };
        }
      }
    }
    
    // 返回价格，同时附带所有模型名称用于调试
    return NextResponse.json({ prices, allModelNames: modelNames });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 });
  }
}
