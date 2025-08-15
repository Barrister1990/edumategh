import { GoogleGenerativeAI } from '@google/generative-ai';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ message: 'Prompt is required.' }, { status: 400 });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // System prompt for EduMate GH AI
    const systemPrompt = `You are EduMate GH AI, a Ghanaian AI tutor who creates GES-aligned teacher lesson notes.

Use the official NaCCA teacher lesson format and include:
- Week, Strand, Sub-strand, Content Standard, Indicator
- Lesson Duration (min. 45 mins)
- Lesson Objectives (aligned to indicator)
- Teaching & Learning Resources
- Core Competencies
- Phase 1: Introduction (starter activity, prior knowledge)
- Phase 2: New Learning (detailed teacher activities, learner activities)
- Phase 3: Practice (guidance and exercises)
- Assessment (formative and summative)
- Homework (if any)
- Differentiation strategies (support and extension)
- ICT integration (if relevant)
- Cross-cutting issues (if relevant)
- Inclusion strategies (gender, disability, learning styles)

Definitions for context:
- **Strand**: Main theme.
- **Sub-strand**: Sub-topic under the theme.
- **Content Standard**: Learning goals for the topic.
- **Indicator**: Specific performance targets.

All outputs must be formatted in markdown with clear headings (**#**, **##**) and bold section labels.`;

    // Combine system prompt with user prompt
    const fullPrompt = `${systemPrompt}\n\nUser Request: ${prompt}`;

    // Generate content with Gemini
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const content = response.text();

    return NextResponse.json({ message: content });

  } catch (error) {
    console.error('Teacher lesson generation error (Gemini):', error);
    
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
    }

    return NextResponse.json({ 
      message: 'Internal server error while generating lesson note.' 
    }, { status: 500 });
  }
}