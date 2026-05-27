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
    
    // 提取我们关心的模型价格
    const prices: Record<string, { inputPrice: number; outputPrice: number }> = {};
    
    if (data.data) {
      for (const model of data.data) {
        const name = model.name;
        const inputPrice = model.pricing?.input || 0;
        const outputPrice = model.pricing?.output || 0;
        
        // 匹配我们表格中的模型
        if (name.includes('Llama-3.3-70B') || name.includes('llama-3.3-70b')) {
          prices['Llama 3.3 70B'] = { inputPrice, outputPrice };
        } else if (name.includes('DeepSeek-V3') || name.includes('deepseek-v3')) {
          prices['DeepSeek V3'] = { inputPrice, outputPrice };
        } else if (name.includes('Mixtral-8x22B')) {
          prices['Mixtral 8x22B'] = { inputPrice, outputPrice };
        }
      }
    }
    
    return NextResponse.json({ prices });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 });
  }
}
