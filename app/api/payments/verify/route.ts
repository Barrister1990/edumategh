import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { reference, userId } = await request.json();

    if (!reference || !userId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Reference and userId are required' 
      }, { status: 400 });
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      throw new Error(paystackData.message || 'Payment verification failed');
    }

    // Check if payment was successful
    if (paystackData.data.status === 'success') {
      // Get payment record from database
      const { data: paymentRecord, error: fetchError } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('paystack_reference', reference)
        .eq('user_id', userId)
        .single();

      if (fetchError) {
        console.error('Database fetch error:', fetchError);
        throw new Error('Payment record not found');
      }

      // Check if payment is already processed
      if (paymentRecord.status === 'completed') {
        return NextResponse.json({
          success: true,
          data: {
            status: 'success',
            message: 'Payment already processed',
            metadata: {
              coinAmount: paymentRecord.coin_amount,
              userId: paymentRecord.user_id
            }
          }
        });
      }

      // Update payment status in database
      const { error: updateError } = await supabase
        .from('payment_transactions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          paystack_data: paystackData.data
        })
        .eq('paystack_reference', reference);

      if (updateError) {
        console.error('Database update error:', updateError);
        throw new Error('Failed to update payment status');
      }

      // Step 1: Try to fetch current balance (but don't fail if user doesn't exist)
      const { data: userCoinData, error: fetchCoinError } = await supabase
        .from('user_coins')
        .select('coin_balance')
        .eq('user_id', userId)
        .single();

      // Only throw error if it's not a "no rows found" error
      if (fetchCoinError && fetchCoinError.code !== 'PGRST116') {
        console.error('Fetch coin error:', fetchCoinError);
        throw new Error('Failed to fetch current coin balance');
      }

      // Step 2: Handle both existing and new users
      if (userCoinData) {
        // User exists, update their balance
        const newBalance = userCoinData.coin_balance + paymentRecord.coin_amount;
        
        const { error: updateCoinsError } = await supabase
          .from('user_coins')
          .update({
            coin_balance: newBalance,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (updateCoinsError) {
          console.error('Coins update error:', updateCoinsError);
          throw new Error('Failed to update coins balance');
        }
      } else {
        // User doesn't exist, create new record
        const { error: insertCoinsError } = await supabase
          .from('user_coins')
          .insert({
            user_id: userId,
            coin_balance: paymentRecord.coin_amount,
            updated_at: new Date().toISOString()
          });

        if (insertCoinsError) {
          console.error('Coins insert error:', insertCoinsError);
          throw new Error('Failed to add coins to account');
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          status: 'success',
          message: 'Payment verified and coins added',
          metadata: {
            coinAmount: paymentRecord.coin_amount,
            userId: paymentRecord.user_id
          }
        }
      });
    } else {
      // Payment failed
      const { error: updateError } = await supabase
        .from('payment_transactions')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          paystack_data: paystackData.data
        })
        .eq('paystack_reference', reference);

      if (updateError) {
        console.error('Database update error:', updateError);
      }

      return NextResponse.json({
        success: false,
        message: 'Payment was not successful',
        data: {
          status: paystackData.data.status,
          gateway_response: paystackData.data.gateway_response
        }
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    return NextResponse.json({
      success: false,
      message: errorMessage
    }, { status: 500 });
  }
}

// Optional: Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}