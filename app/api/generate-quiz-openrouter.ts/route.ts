import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ message: 'Prompt is required.' }, { status: 400 });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.SITE_URL || '',
        'X-Title': process.env.SITE_NAME || '',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528:free',
        messages: [
          {
            role: 'system',
            content: `You are an expert educational content creator for the Ghana Education Service (GES) curriculum. 
You create high-quality, curriculum-aligned quiz questions based on the following structure:
- **Strand**: A major theme (e.g., Number).
- **Sub-strand**: A specific topic under the strand (e.g., Number and Numeration).
- **Content Standard**: A learning goal students should achieve.
- **Indicator**: A measurable skill that demonstrates mastery.

Use Bloom’s Taxonomy levels and ensure questions are age-appropriate, clear, and match Ghanaian curriculum standards.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ message: errorData.error?.message || 'Quiz generation failed (OpenRouter).' }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    return NextResponse.json({ message: content });
  } catch (error) {
    console.error('OpenRouter Quiz API Error:', error);
    return NextResponse.json({ message: 'Internal server error while generating quiz (OpenRouter).' }, { status: 500 });
  }
}
