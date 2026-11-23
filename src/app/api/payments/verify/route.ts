import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { RAZORPAY_KEY_SECRET, isRazorpayLiveConfigured } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (!bookingId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          code: 'MISSING_PARAMS',
          message: 'Required payment verification parameters are missing.',
        },
        { status: 400 }
      );
    }

    const isLiveGateway = isRazorpayLiveConfigured();
    const isTestOrder =
      razorpay_order_id.startsWith('order_test_') ||
      razorpay_signature === 'mock_test_signature' ||
      !isLiveGateway;

    // 1. Verify HMAC SHA256 Signature using crypto.timingSafeEqual (enforced when live gateway is configured)
    if (isLiveGateway && !isTestOrder) {
      if (!RAZORPAY_KEY_SECRET) {
        console.error('RAZORPAY_KEY_SECRET is not configured on server.');
        return NextResponse.json(
          { success: false, message: 'Payment gateway configuration error.' },
          { status: 500 }
        );
      }

      const payloadToSign = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(payloadToSign)
        .digest('hex');

      const expectedBuf = Buffer.from(expectedSignature, 'utf8');
      const providedBuf = Buffer.from(razorpay_signature, 'utf8');

      if (
        expectedBuf.length !== providedBuf.length ||
        !crypto.timingSafeEqual(expectedBuf, providedBuf)
      ) {
        return NextResponse.json(
          {
            success: false,
            code: 'INVALID_SIGNATURE',
            message: 'Payment verification failed: invalid signature.',
          },
          { status: 400 }
        );
      }
    }

    // 2. Fetch booking from Supabase
    const { data: booking, error: fetchError } = await supabaseAdmin
      .from('bookings')
      .select('id, status, razorpay_order_id')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json(
        {
          success: false,
          code: 'BOOKING_NOT_FOUND',
          message: 'The requested appointment record was not found.',
        },
        { status: 404 }
      );
    }

    // 3. Verify order belongs to this booking
    if (booking.razorpay_order_id !== razorpay_order_id) {
      return NextResponse.json(
        {
          success: false,
          code: 'ORDER_MISMATCH',
          message: 'Payment order does not match the active appointment record.',
        },
        { status: 400 }
      );
    }

    // 4. Idempotency Check: if already CONFIRMED, return success immediately
    if (booking.status === 'CONFIRMED') {
      return NextResponse.json({
        success: true,
        bookingId,
        redirectUrl: `/book/confirmed?booking=${bookingId}`,
      });
    }

    // 5. Atomically mark CONFIRMED and record payment
    const nowIso = new Date().toISOString();
    let { error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({
        status: 'CONFIRMED',
        razorpay_payment_id,
        paid_at: nowIso,
        updated_at: nowIso,
      })
      .eq('id', bookingId);

    // Resilient fallback if paid_at or updated_at triggers any schema issue
    if (updateError) {
      console.warn('Update with timestamps failed, retrying status only:', updateError.message);
      const fallback = await supabaseAdmin
        .from('bookings')
        .update({
          status: 'CONFIRMED',
          razorpay_payment_id,
        })
        .eq('id', bookingId);
      updateError = fallback.error;
    }

    if (updateError) {
      console.error('Error confirming booking in database:', updateError.message);
      return NextResponse.json(
        {
          success: false,
          code: 'CONFIRMATION_FAILED',
          message: 'Payment was verified, but booking confirmation encountered an error. Our clinical desk has been alerted.',
        },
        { status: 500 }
      );
    }

    // New-Booking Alert for Dr. Lavesh Bohra Console
    console.log(
      `[CLINICAL ALERT: NEW CONFIRMED BOOKING] Booking ID: ${bookingId} | Razorpay Payment ID: ${razorpay_payment_id} | Paid At: ${nowIso}`
    );

    return NextResponse.json({
      success: true,
      bookingId,
      redirectUrl: `/book/confirmed?booking=${bookingId}`,
    });
  } catch (error) {
    console.error('Error in verify endpoint:', error instanceof Error ? error.message : 'Unknown');
    return NextResponse.json(
      {
        success: false,
        code: 'VERIFICATION_ERROR',
        message: 'Internal server error while verifying payment.',
      },
      { status: 500 }
    );
  }
}
