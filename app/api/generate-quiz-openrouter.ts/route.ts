import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ 
        error: { message: 'Prompt is required.' }
      }, { status: 400 });
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

Use Bloom's Taxonomy levels and ensure questions are age-appropriate, clear, and match Ghanaian curriculum standards.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    // Get response text first to debug
    const responseText = await response.text();
    console.log('OpenRouter raw response:', responseText);

    if (!response.ok) {
      console.error('OpenRouter API error:', response.status, response.statusText, responseText);
      return NextResponse.json({ 
        error: { 
          message: `OpenRouter API error: ${response.status} - ${responseText}` 
        }
      }, { status: 500 });
    }

    // Parse the JSON response
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse OpenRouter response:', responseText);
      const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown parsing error';
      return NextResponse.json({ 
        error: { 
          message: `Invalid JSON response from OpenRouter: ${errorMessage}` 
        }
      }, { status: 500 });
    }

    // Validate response structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected OpenRouter response structure:', data);
      return NextResponse.json({ 
        error: { 
          message: 'Unexpected response structure from OpenRouter' 
        }
      }, { status: 500 });
    }

    // Return the response in the expected format (same as OpenAI/DeepSeek)
    return NextResponse.json(data);

  } catch (error) {
    console.error('OpenRouter Quiz API Error:', error);
    return NextResponse.json({ 
      error: { 
        message: 'Internal server error while generating quiz (OpenRouter).' 
      }
    }, { status: 500 });
  }
}