import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

export async function POST(request: NextRequest) {
  try {
    const { title, message, targetAudience, category } = await request.json();

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      );
    }

    // Build query based on target audience
    let query = supabase
      .from('users')
      .select('id, expoPushToken, role')
      .not('expoPushToken', 'is', null);

    if (targetAudience !== 'all') {
      query = query.eq('role', targetAudience.slice(0, -1)); // Remove 's' from 'students'/'teachers'
    }

    const { data: users, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: 'No users found with push tokens for the selected audience' },
        { status: 404 }
      );
    }

    // Create notifications array
    const notifications = users.map((user) => ({
      to: user.expoPushToken,
      sound: "default",
      title: title,
      body: message,
      data: {
        type: category,
        screen: "Home",
        userId: user.id
      }
    }));

    // Send notifications in chunks (Expo recommends max 100 per request)
    const chunks = [];
    const chunkSize = 100;
    for (let i = 0; i < notifications.length; i += chunkSize) {
      chunks.push(notifications.slice(i, i + chunkSize));
    }

    let totalSent = 0;
    const results = [];

    for (const chunk of chunks) {
      console.log(`📦 Sending chunk of ${chunk.length} notifications...`);
      
      try {
        const response = await fetch(EXPO_PUSH_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate',
          },
          body: JSON.stringify(chunk)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("✅ Expo response:", result);
        results.push(result);
        totalSent += chunk.length;
      } catch (chunkError) {
        console.error(`❌ Error sending chunk:`, chunkError);
        // Continue with other chunks even if one fails
      }
    }

    console.log("✅ All notifications sent successfully.");
    
    return NextResponse.json({
      success: true,
      message: `Successfully sent ${totalSent} notifications`,
      totalSent,
      totalUsers: users.length,
      chunks: chunks.length,
      results
    });

  } catch (error) {
    console.error("❌ Error sending notifications:", error);
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  // Allow requests from localhost and your domain
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://172.21.48.1:3000',
    'https://edumategh.com',
    'https://www.edumategh.com'
  ];

  if (origin && allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  return new NextResponse(null, { status: 403 });
}
