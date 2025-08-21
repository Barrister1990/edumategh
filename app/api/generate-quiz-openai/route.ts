import { GoogleGenerativeAI } from '@google/generative-ai';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'This endpoint only accepts POST requests with a prompt in the body.' 
  }, { status: 405 });
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ message: 'Prompt is required.' }, { status: 400 });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    // Enhanced system prompt for GES curriculum quiz generation
    const systemPrompt = `You are an expert educational content creator for the Ghana Education Service (GES) curriculum.
You generate high-quality quiz questions based on the following structure:

- **Strand**: A major learning area or theme (e.g., Number, Algebra, ICT Tools).
- **Sub-strand**: A specific topic under the strand (e.g., Number and Numeration).
- **Content Standard**: Describes what learners should know and be able to do by the end of a phase.
- **Indicator**: A measurable skill or performance objective under a content standard.

**CRITICAL: Your questions must follow the EXACT GES Ghanaian Curriculum format structure:**

**SECTION B (Theory Questions) Format:**
- Main questions are numbered: Question 1, Question 2, Question 3...
- First sub-question is ALWAYS "a)" (not a, b, c)
- Parts use "i)", "ii)" format
- Follow exact GES structure as shown in examples below

**GES Format Examples:**

**Social Studies Section B Format:**
Question 1
a) 
- i) Describe the Solar System.
- ii) Name four planets in the Solar System.
b) Outline two effects of the rotation of the earth.
c) Highlight two effects of the revolution of the earth.

**Mathematics Section B Format:**
Question 1
a) Given that P = {multiples of 3} and Q = {positive even numbers}:
- i) List the elements in P ∩ Q
- ii) List all the subsets in P ∩ Q
b) If 1y = 3k - 2x:
- i) make y the subject of the relation
- ii) using the result in (b)(i)), find the value of y when x = -1 and k = 2

**Your questions must align with the Ghanaian curriculum, follow Bloom's Taxonomy levels (Remember, Understand, Apply, Analyze, Evaluate, Create), and be age-appropriate. Questions should be clear, concise, and relevant to the GES standards.**

**IMPORTANT: When generating Section B questions, ensure:**
1. Main questions start with "Question 1", "Question 2", etc.
2. First sub-question is always "a)"
3. Parts use "i)", "ii)" format
4. Follow the exact structure shown in the examples above
5. Maintain the GES curriculum standards and difficulty levels`;

    // Combine system prompt with user prompt
    const fullPrompt = `${systemPrompt}\n\nUser Request: ${prompt}`;

    // Generate content with Gemini
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const content = response.text();

    return NextResponse.json({ message: content });

  } catch (error) {
    console.error('Quiz generation error (Gemini):', error);
    
    // Handle specific Gemini API errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json({ 
          message: 'Invalid API key. Please check your Gemini API configuration.' 
        }, { status: 401 });
      }
      if (error.message.includes('quota')) {
        return NextResponse.json({ 
          message: 'API quota exceeded. Please try again later.' 
        }, { status: 429 });
      }
      if (error.message.includes('safety')) {
        return NextResponse.json({ 
          message: 'Content filtered by safety settings. Please try rephrasing your request.' 
        }, { status: 400 });
      }
    }

    return NextResponse.json({ 
      message: 'Internal server error while generating quiz.' 
    }, { status: 500 });
  }
}