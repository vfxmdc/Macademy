import { getDb } from './db';
import { Resource, TimeSlot, Booking, BlockRule, AvailabilityRule } from './types';

// Helper to format ISO or local date strings
export function isOverlapping(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date
): boolean {
  return startA < endB && endA > startB;
}

/**
 * Validates whether a proposed booking range is completely available.
 * Checks against:
 * 1. Resource active status
 * 2. Blocked rules
 * 3. Existing active bookings (CONFIRMED or PENDING)
 * 4. Resource working hours / availability rules
 */
export function validateBookingAvailability(
  resourceId: string,
  startDateTimeIso: string,
  endDateTimeIso: string,
  excludeBookingId?: string
): { isAvailable: boolean; reason?: string } {
  const db = getDb();
  const resource = db.resources.find(r => r.id === resourceId);

  if (!resource) {
    return { isAvailable: false, reason: 'Resource not found' };
  }

  if (!resource.isActive) {
    return { isAvailable: false, reason: 'Resource is currently inactive' };
  }

  const reqStart = new Date(startDateTimeIso);
  const reqEnd = new Date(endDateTimeIso);

  if (isNaN(reqStart.getTime()) || isNaN(reqEnd.getTime())) {
    return { isAvailable: false, reason: 'Invalid date format' };
  }

  if (reqStart >= reqEnd) {
    return { isAvailable: false, reason: 'Start time must be before end time' };
  }

  // 1. Check Block rules
  const blocks = db.blockRules.filter(
    b => b.resourceId === 'ALL' || b.resourceId === resourceId
  );

  for (const block of blocks) {
    const blockStart = new Date(`${block.startDate}T${block.startTime || '00:00'}:00`);
    const blockEnd = new Date(`${block.endDate}T${block.endTime || '23:59'}:59`);
    if (isOverlapping(reqStart, reqEnd, blockStart, blockEnd)) {
      return {
        isAvailable: false,
        reason: `Blocked by: ${block.title} (${block.startDate} to ${block.endDate})`
      };
    }
  }

  // 2. Check Existing Bookings (Double Booking Protection)
  const existingBookings = db.bookings.filter(
    b =>
      b.resourceId === resourceId &&
      b.status !== 'CANCELLED' &&
      b.id !== excludeBookingId
  );

  for (const booking of existingBookings) {
    const bStart = new Date(booking.startDateTime);
    const bEnd = new Date(booking.endDateTime);
    if (isOverlapping(reqStart, reqEnd, bStart, bEnd)) {
      return {
        isAvailable: false,
        reason: `This resource is already booked for the selected date/time (${booking.startDateTime.replace('T', ' ').slice(0, 16)} - ${booking.endDateTime.replace('T', ' ').slice(0, 16)})`
      };
    }
  }

  // 3. For TIME_SLOT bookings, check weekly availability rules
  if (resource.bookingMode === 'TIME_SLOT') {
    const dayOfWeek = reqStart.getDay(); // 0 = Sun, 1 = Mon ...
    const rules = db.availabilityRules.filter(
      r => (r.resourceId === 'ALL' || r.resourceId === resourceId) && r.dayOfWeek === dayOfWeek
    );

    if (rules.length > 0) {
      const reqStartMinutes = reqStart.getHours() * 60 + reqStart.getMinutes();
      const reqEndMinutes = reqEnd.getHours() * 60 + reqEnd.getMinutes();

      const fitsRule = rules.some(rule => {
        if (!rule.isAvailable) return false;
        const [sH, sM] = rule.startTime.split(':').map(Number);
        const [eH, eM] = rule.endTime.split(':').map(Number);
        const ruleStartMinutes = sH * 60 + sM;
        const ruleEndMinutes = eH * 60 + eM;

        return reqStartMinutes >= ruleStartMinutes && reqEndMinutes <= ruleEndMinutes;
      });

      if (!fitsRule) {
        return {
          isAvailable: false,
          reason: 'Selected time slot falls outside of designated working hours'
        };
      }
    }
  }

  return { isAvailable: true };
}

/**
 * Generate available time slots for a specific resource on a given date (YYYY-MM-DD)
 */
export function generateTimeSlotsForDate(
  resourceId: string,
  dateStr: string // "YYYY-MM-DD"
): TimeSlot[] {
  const db = getDb();
  const resource = db.resources.find(r => r.id === resourceId);
  if (!resource || !resource.isActive) return [];

  const targetDate = new Date(`${dateStr}T00:00:00`);
  const dayOfWeek = targetDate.getDay();

  // Find rules for this day
  const rules = db.availabilityRules.filter(
    r => (r.resourceId === 'ALL' || r.resourceId === resourceId) && r.dayOfWeek === dayOfWeek && r.isAvailable
  );

  if (rules.length === 0) {
    // Default fallback working hours: 09:00 - 17:00 if no rule defined for that day
    rules.push({
      id: 'default-rule',
      resourceId: 'ALL',
      dayOfWeek,
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: true
    });
  }

  const slotMinutes = resource.slotDurationMinutes || 30;
  const slots: TimeSlot[] = [];

  const activeBookings = db.bookings.filter(
    b => b.resourceId === resourceId && b.status !== 'CANCELLED'
  );

  const blockRules = db.blockRules.filter(
    b => b.resourceId === 'ALL' || b.resourceId === resourceId
  );

  for (const rule of rules) {
    const [sH, sM] = rule.startTime.split(':').map(Number);
    const [eH, eM] = rule.endTime.split(':').map(Number);

    let startMins = sH * 60 + sM;
    const endMins = eH * 60 + eM;

    while (startMins + slotMinutes <= endMins) {
      const curSH = Math.floor(startMins / 60);
      const curSM = startMins % 60;
      const slotStart = new Date(targetDate);
      slotStart.setHours(curSH, curSM, 0, 0);

      const endSlotMins = startMins + slotMinutes;
      const curEH = Math.floor(endSlotMins / 60);
      const curEM = endSlotMins % 60;
      const slotEnd = new Date(targetDate);
      slotEnd.setHours(curEH, curEM, 0, 0);

      const slotStartStr = `${String(curSH).padStart(2, '0')}:${String(curSM).padStart(2, '0')}`;
      const slotEndStr = `${String(curEH).padStart(2, '0')}:${String(curEM).padStart(2, '0')}`;

      // Check block rules
      let isBlocked = false;
      for (const block of blockRules) {
        const bStart = new Date(`${block.startDate}T${block.startTime || '00:00'}:00`);
        const bEnd = new Date(`${block.endDate}T${block.endTime || '23:59'}:59`);
        if (isOverlapping(slotStart, slotEnd, bStart, bEnd)) {
          isBlocked = true;
          break;
        }
      }

      // Check existing bookings
      let bookedId: string | undefined;
      for (const booking of activeBookings) {
        const bStart = new Date(booking.startDateTime);
        const bEnd = new Date(booking.endDateTime);
        if (isOverlapping(slotStart, slotEnd, bStart, bEnd)) {
          bookedId = booking.id;
          break;
        }
      }

      let reason: 'BOOKED' | 'BLOCKED' | 'OFF_HOURS' | undefined;
      let isAvailable = true;

      if (isBlocked) {
        isAvailable = false;
        reason = 'BLOCKED';
      } else if (bookedId) {
        isAvailable = false;
        reason = 'BOOKED';
      }

      slots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        startTimeStr: slotStartStr,
        endTimeStr: slotEndStr,
        isAvailable,
        reason,
        bookingId: bookedId
      });

      startMins += slotMinutes;
    }
  }

  return slots;
}
