import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { CLINIC_SCHEDULE, getStandardDaySlots } from '@/lib/config/schedule';
import { BOOKING_CONFIG } from '@/lib/config/booking';

export const dynamic = 'force-dynamic';

export type SlotStatus = 'available' | 'booked' | 'held' | 'past' | 'too_soon';

export interface DaySlotResponse {
  start: string;
  end: string;
  label: string;
  period: 'morning' | 'evening';
  status: SlotStatus;
}

export interface DayScheduleResponse {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  dayName: string;
  isOpen: boolean;
  slots: DaySlotResponse[];
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Returns YYYY-MM-DD string for a Date object in Asia/Kolkata timezone
 */
function toISTDateString(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

/**
 * Adds integer days to an ISO YYYY-MM-DD date string in IST
 */
function addDaysIST(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().split('T')[0];
}

/**
 * GET /api/slots
 * Query Params:
 *  - from: YYYY-MM-DD (defaults to current date in IST)
 *  - to: YYYY-MM-DD (defaults to 13 days after 'from', making a 14-day window)
 *  - doctorId: string (defaults to 'dr-lavesh-bohra')
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const now = new Date();
    const serverNow = now.toISOString();
    const nowMs = now.getTime();
    const minLeadMinutes = BOOKING_CONFIG.minLeadMinutes; // 60 minutes
    const todayIST = toISTDateString(now);

    const from = searchParams.get('from') || todayIST;
    const to = searchParams.get('to') || addDaysIST(from, 13);
    const doctorId = searchParams.get('doctorId') || BOOKING_CONFIG.doctorId;

    // 1. Fetch active bookings from Supabase for this doctor and date range
    let activeBookingMap = new Map<string, 'booked' | 'held'>();

    try {
      const { data: bookingsData, error: dbError } = await supabaseAdmin
        .from('bookings')
        .select('appointment_date, slot_start, slot_end, status, hold_expires_at')
        .eq('doctor_id', doctorId)
        .gte('appointment_date', from)
        .lte('appointment_date', to)
        .in('status', ['CONFIRMED', 'PENDING_PAYMENT']);

      if (dbError) {
        // Log error if table permissions or network issue occurred, but proceed safely
        console.warn('Supabase query warning in /api/slots:', dbError.message);
      } else if (bookingsData) {
        for (const b of bookingsData) {
          const key = `${b.appointment_date}_${b.slot_start}`;
          if (b.status === 'CONFIRMED') {
            activeBookingMap.set(key, 'booked');
          } else if (b.status === 'PENDING_PAYMENT') {
            // Check if hold is still active or expired
            if (b.hold_expires_at && new Date(b.hold_expires_at).getTime() > nowMs) {
              activeBookingMap.set(key, 'held');
            }
          }
        }
      }
    } catch (fetchErr) {
      console.warn('Failed connecting to Supabase in /api/slots:', fetchErr);
    }

    // 2. Generate standard schedule template
    const standardSlots = getStandardDaySlots();

    // 3. Compute slots for each date in range [from, to]
    const days: DayScheduleResponse[] = [];
    let currentDate = from;

    // Safety limit of at most 30 days
    let iterations = 0;
    while (currentDate <= to && iterations < 31) {
      iterations++;
      const [year, month, day] = currentDate.split('-').map(Number);
      // Construct UTC date at noon to determine day-of-week cleanly
      const dayDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
      const dayOfWeek = dayDate.getUTCDay(); // 0=Sunday, 1=Monday...
      const dayName = DAY_NAMES[dayOfWeek];

      const isConfiguredActive = CLINIC_SCHEDULE.activeDaysOfWeek.includes(dayOfWeek);
      const isBlocked = CLINIC_SCHEDULE.blockedDates.includes(currentDate);
      const isOpen = isConfiguredActive && !isBlocked;

      if (!isOpen) {
        days.push({
          date: currentDate,
          dayOfWeek,
          dayName,
          isOpen: false,
          slots: [],
        });
      } else {
        const daySlots: DaySlotResponse[] = standardSlots.map((slot) => {
          // Exact slot start timestamp in IST (Asia/Kolkata is strictly UTC+05:30)
          const slotStartIso = `${currentDate}T${slot.start}:00+05:30`;
          const slotStartMs = new Date(slotStartIso).getTime();

          let status: SlotStatus;

          if (slotStartMs <= nowMs) {
            status = 'past';
          } else if (slotStartMs < nowMs + minLeadMinutes * 60 * 1000) {
            status = 'too_soon';
          } else {
            const key = `${currentDate}_${slot.start}`;
            const existing = activeBookingMap.get(key);
            if (existing) {
              status = existing;
            } else {
              status = 'available';
            }
          }

          return {
            start: slot.start,
            end: slot.end,
            label: slot.label,
            period: slot.period,
            status,
          };
        });

        days.push({
          date: currentDate,
          dayOfWeek,
          dayName,
          isOpen: true,
          slots: daySlots,
        });
      }

      currentDate = addDaysIST(currentDate, 1);
    }

    return NextResponse.json(
      {
        success: true,
        serverNow,
        timezone: 'Asia/Kolkata',
        minLeadMinutes,
        doctorId,
        from,
        to,
        days,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error) {
    // Let Next.js internal prerender/bailout signals bubble cleanly
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof (error as { digest?: unknown }).digest === 'string' &&
      ((error as { digest: string }).digest.startsWith('NEXT_'))
    ) {
      throw error;
    }
    console.error('Unhandled error in /api/slots:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
