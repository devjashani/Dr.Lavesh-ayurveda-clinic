import { NextRequest, NextResponse, after } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { RAZORPAY_WEBHOOK_SECRET } from '@/lib/razorpay';
import { getSiteBaseUrl } from '@/lib/email/send';
import {
  sendBookingConfirmationEmails,
  type ConfirmedBookingEmailRecord,
} from '@/lib/email/bookingConfirmation';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';

    if (!RAZORPAY_WEBHOOK_SECRET) {
      console.warn('RAZORPAY_WEBHOOK_SECRET is not configured on server.');
      return NextResponse.json(
        { success: false, message: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    if (!signature) {
      return NextResponse.json(
        { success: false, message: 'Missing Razorpay signature' },
        { status: 400 }
      );
    }

    // 1. Verify Webhook Signature via HMAC SHA256
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    const expectedBuf = Buffer.from(expectedSignature, 'utf8');
    const providedBuf = Buffer.from(signature, 'utf8');

    if (
      expectedBuf.length !== providedBuf.length ||
      !crypto.timingSafeEqual(expectedBuf, providedBuf)
    ) {
      return NextResponse.json(
        { success: false, message: 'Invalid webhook signature' },
        { status: 400 }
      );
    }

    // 2. Parse Event Payload
    const event = JSON.parse(rawBody);
    const eventType: string = event.event;

    // 3. Handle Events
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const orderId: string | undefined =
        event.payload?.payment?.entity?.order_id || event.payload?.order?.entity?.id;
      const paymentId: string | undefined = event.payload?.payment?.entity?.id;

      if (orderId) {
        // Query booking by razorpay_order_id
        const { data: booking } = await supabaseAdmin
          .from('bookings')
          .select('id, status')
          .eq('razorpay_order_id', orderId)
          .single();

        if (booking && booking.status !== 'CONFIRMED') {
          const nowIso = new Date().toISOString();
          let { data: updatedBooking, error: updateErr } = await supabaseAdmin
            .from('bookings')
            .update({
              status: 'CONFIRMED',
              razorpay_payment_id: paymentId || null,
              paid_at: nowIso,
              updated_at: nowIso,
            })
            .eq('id', booking.id)
            .neq('status', 'CONFIRMED')
            .select('*')
            .maybeSingle();

          if (updateErr) {
            const fallback = await supabaseAdmin
              .from('bookings')
              .update({
                status: 'CONFIRMED',
                razorpay_payment_id: paymentId || null,
              })
              .eq('id', booking.id)
              .neq('status', 'CONFIRMED')
              .select('*')
              .maybeSingle();
            updatedBooking = fallback.data;
          }

          console.log(
            `[CLINICAL ALERT: WEBHOOK CONFIRMED BOOKING] Booking ID: ${booking.id} | Order: ${orderId} | Payment: ${paymentId || 'captured'}`
          );

          if (updatedBooking) {
            const siteUrl = getSiteBaseUrl(request.nextUrl.origin);
            const emailBooking = updatedBooking as ConfirmedBookingEmailRecord;
            after(async () => {
              await sendBookingConfirmationEmails(emailBooking, siteUrl);
            });
          }
        }
      }
    } else if (eventType === 'payment.failed') {
      const orderId: string | undefined = event.payload?.payment?.entity?.order_id;
      if (orderId) {
        const { data: booking } = await supabaseAdmin
          .from('bookings')
          .select('id, status')
          .eq('razorpay_order_id', orderId)
          .single();

        // If payment failed and slot was still held, release the hold immediately
        if (booking && booking.status === 'PENDING_PAYMENT') {
          await supabaseAdmin
            .from('bookings')
            .update({
              status: 'CANCELLED',
              updated_at: new Date().toISOString(),
            })
            .eq('id', booking.id);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error instanceof Error ? error.message : 'Unknown');
    return NextResponse.json(
      { success: false, message: 'Webhook processing error' },
      { status: 500 }
    );
  }
}
