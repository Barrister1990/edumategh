// app/api/text-to-speech/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId } = await request.json();

    // Validate input
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    // Get API key from environment variables
    const apiKey = process.env.ELEVEN_LABS_API_KEY;
    const defaultVoiceId = process.env.ELEVEN_LABS_VOICE_ID;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    // Use provided voiceId or fall back to default
    const finalVoiceId = voiceId || defaultVoiceId;
    
    if (!finalVoiceId) {
      return NextResponse.json(
        { error: 'Voice ID not provided or configured' },
        { status: 400 }
      );
    }

    // Call ElevenLabs API
    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${finalVoiceId}`;
    
    const response = await fetch(elevenLabsUrl, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to generate speech' },
        { status: response.status }
      );
    }

    // Get the audio data as ArrayBuffer
    const audioBuffer = await response.arrayBuffer();
    
    // Convert to base64 for easier handling in React Native
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    return NextResponse.json({
      success: true,
      audio: base64Audio,
      contentType: 'audio/mpeg'
    });

  } catch (error) {
    console.error('Text-to-speech API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Add a GET endpoint to check API status
export async function GET() {
  const apiKey = process.env.ELEVEN_LABS_API_KEY;
  
  return NextResponse.json({
    configured: !!apiKey,
    timestamp: new Date().toISOString()
  });
}