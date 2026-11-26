/**
 * VANKAL AYURVEDA — CLINICAL SCHEDULE CONFIGURATION
 * 
 * All timings and dates are strictly in the Asia/Kolkata (IST, UTC+05:30) timezone.
 * 
 * Active OPD Schedule:
 * - 30-minute consultation slots followed by a 20-minute clinical buffer/rest gap
 * - Morning session: 10:00 AM to 01:00 PM (10:00–10:30, 10:50–11:20, 11:40–12:10, 12:30–13:00)
 * - Evening session: 05:00 PM to 08:10 PM (17:00–17:30, 17:50–18:20, 18:40–19:10, 19:30–20:00)
 */

export interface ScheduleWindow {
  start: string; // HH:mm in 24h format e.g. "10:00"
  end: string;   // HH:mm in 24h format e.g. "13:00"
}

export interface ClinicScheduleConfig {
  timezone: string;
  slotDurationMinutes: number;
  bufferMinutes: number;
  activeDaysOfWeek: number[]; // 0=Sunday, 1=Monday, ..., 6=Saturday
  windows: {
    morning: ScheduleWindow;
    evening: ScheduleWindow;
  };
  blockedDates: string[]; // ISO YYYY-MM-DD
}

export const CLINIC_SCHEDULE: ClinicScheduleConfig = {
  timezone: 'Asia/Kolkata',
  slotDurationMinutes: 30,
  bufferMinutes: 20,
  // Monday (1) through Saturday (6) active; Sunday (0) closed
  activeDaysOfWeek: [1, 2, 3, 4, 5, 6],
  windows: {
    // 10:00 AM to 01:00 PM (4 slots: 10:00–10:30, 10:50–11:20, 11:40–12:10, 12:30–13:00)
    morning: {
      start: '10:00',
      end: '13:00',
    },
    // 05:00 PM to 08:10 PM (4 slots: 17:00–17:30, 17:50–18:20, 18:40–19:10, 19:30–20:00)
    evening: {
      start: '17:00',
      end: '20:10',
    },
  },
  blockedDates: [],
};

export interface GeneratedSlot {
  start: string; // "10:00"
  end: string;   // "10:30"
  label: string; // "10:00 AM – 10:30 AM"
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
 * Generates sequential slots for a window with a buffer gap after each slot
 */
function generateWindowSlots(
  window: ScheduleWindow,
  durationMinutes: number,
  bufferMinutes: number,
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

    currentTotalMin += durationMinutes + bufferMinutes;
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
    CLINIC_SCHEDULE.bufferMinutes,
    'morning'
  );
  const evening = generateWindowSlots(
    CLINIC_SCHEDULE.windows.evening,
    CLINIC_SCHEDULE.slotDurationMinutes,
    CLINIC_SCHEDULE.bufferMinutes,
    'evening'
  );
  return [...morning, ...evening];
}
