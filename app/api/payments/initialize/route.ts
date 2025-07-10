import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { amount, email, userId, packageId, coinAmount, metadata } = await request.json();

    if (!amount || !email || !userId || !packageId || !coinAmount) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 });
    }

    // Generate a unique reference
    const reference = `coin_purchase_${userId}_${Date.now()}`;

    // Initialize payment with Paystack
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount, // Amount in kobo
        reference,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/callback`,
        metadata: {
          ...metadata,
          userId,
          packageId,
          coinAmount
        }
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      throw new Error(paystackData.message || 'Payment initialization failed');
    }

    // Store payment record in database
    const { error: dbError } = await supabase
      .from('payment_transactions')
      .insert({
        reference,
        user_id: userId,
        amount: amount / 100, // Convert back to naira for storage
        coin_amount: coinAmount,
        package_id: packageId,
        status: 'pending',
        paystack_reference: paystackData.data.reference,
        created_at: new Date().toISOString()
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to store payment record');
    }

    return NextResponse.json({
      success: true,
      data: {
        reference: paystackData.data.reference,
        authorization_url: paystackData.data.authorization_url
      }
    });

  } catch (error: unknown) {
    console.error('Payment initialization error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json({
      success: false,
      message: errorMessage,
    }, { status: 500 });
  }
}

// Optional: Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}