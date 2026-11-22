/**
 * VANKAL AYURVEDA — CLINICAL SCHEDULE CONFIGURATION
 * 
 * All timings and dates are strictly in the Asia/Kolkata (IST, UTC+05:30) timezone.
 * 
 * ⚠️ PLACEHOLDER TIMINGS NOTICE:
 * The morning (10:00 - 13:00) and evening (17:00 - 19:00) 20-minute slot windows
 * are placeholder defaults. Real practitioner clinic timings must be updated
 * as flagged in TODO.md.
 */

export interface ScheduleWindow {
  start: string; // HH:mm in 24h format e.g. "10:00"
  end: string;   // HH:mm in 24h format e.g. "13:00"
}

export interface ClinicScheduleConfig {
  timezone: string;
  slotDurationMinutes: number;
  activeDaysOfWeek: number[]; // 0=Sunday, 1=Monday, ..., 6=Saturday
  windows: {
    morning: ScheduleWindow;
    evening: ScheduleWindow;
  };
  blockedDates: string[]; // ISO YYYY-MM-DD
}

export const CLINIC_SCHEDULE: ClinicScheduleConfig = {
  timezone: 'Asia/Kolkata',
  slotDurationMinutes: 20,
  // Monday (1) through Saturday (6) active; Sunday (0) closed
  activeDaysOfWeek: [1, 2, 3, 4, 5, 6],
  windows: {
    // PLACEHOLDER: 10:00 AM to 01:00 PM (9 slots: 10:00, 10:20, 10:40, 11:00, 11:20, 11:40, 12:00, 12:20, 12:40)
    morning: {
      start: '10:00',
      end: '13:00',
    },
    // PLACEHOLDER: 05:00 PM to 07:00 PM (6 slots: 17:00, 17:20, 17:40, 18:00, 18:20, 18:40)
    evening: {
      start: '17:00',
      end: '19:00',
    },
  },
  blockedDates: [],
};

export interface GeneratedSlot {
  start: string; // "10:00"
  end: string;   // "10:20"
  label: string; // "10:00 AM – 10:20 AM"
  period: 'morning' | 'evening';
}

/**
 * Converts "HH:mm" 24h time to 12h label e.g. "10:00" -> "10:00 AM"
 */
export function formatTime12h(time24: string): string {
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
}

/**
 * Generates all sequential slots for a single window
 */
function generateWindowSlots(
  window: ScheduleWindow,
  durationMinutes: number,
  period: 'morning' | 'evening'
): GeneratedSlot[] {
  const slots: GeneratedSlot[] = [];
  const [startH, startM] = window.start.split(':').map(Number);
  const [endH, endM] = window.end.split(':').map(Number);

  let currentTotalMin = startH * 60 + startM;
  const endTotalMin = endH * 60 + endM;

  while (currentTotalMin + durationMinutes <= endTotalMin) {
    const slotStartH = Math.floor(currentTotalMin / 60);
    const slotStartM = currentTotalMin % 60;
    const slotEndMin = currentTotalMin + durationMinutes;
    const slotEndH = Math.floor(slotEndMin / 60);
    const slotEndM = slotEndMin % 60;

    const start24 = `${slotStartH.toString().padStart(2, '0')}:${slotStartM.toString().padStart(2, '0')}`;
    const end24 = `${slotEndH.toString().padStart(2, '0')}:${slotEndM.toString().padStart(2, '0')}`;

    slots.push({
      start: start24,
      end: end24,
      label: `${formatTime12h(start24)} – ${formatTime12h(end24)}`,
      period,
    });

    currentTotalMin += durationMinutes;
  }

  return slots;
}

/**
 * Returns the fixed set of daytime slots available on active OPD days
 */
export function getStandardDaySlots(): GeneratedSlot[] {
  const morning = generateWindowSlots(
    CLINIC_SCHEDULE.windows.morning,
    CLINIC_SCHEDULE.slotDurationMinutes,
    'morning'
  );
  const evening = generateWindowSlots(
    CLINIC_SCHEDULE.windows.evening,
    CLINIC_SCHEDULE.slotDurationMinutes,
    'evening'
  );
  return [...morning, ...evening];
}
