import { VenueOpenStatus } from '../types/food';

/**
 * Parses opening hours text and compares against current India Standard Time (IST / UTC+5:30)
 * Handles overnight hours across midnight (e.g. 8:00 PM – 2:00 AM), 24-hour places,
 * and preserves strict "Unverified" labels without making false "Open now" claims.
 */
export function evaluateVenueOpenStatus(openingHoursStr: string, statusStr: string): VenueOpenStatus {
  // Rule 1: If explicitly unverified in status or hours string, NEVER label "Open now"
  const isExplicitlyUnverified = 
    statusStr.toLowerCase().includes('unverified') || 
    openingHoursStr.toLowerCase().includes('unverified');

  if (isExplicitlyUnverified) {
    return {
      isOpen: false,
      isUnverified: true,
      badgeText: 'Unverified — Check before visiting',
      statusColor: 'amber',
      disclaimer: 'Hours fluctuate due to municipal/police regulations. Please confirm before visiting.'
    };
  }

  // Rule 2: Explicit 24 Hours
  const normalizedHours = openingHoursStr.toLowerCase();
  if (normalizedHours.includes('open 24 hours') || normalizedHours.includes('24 hours daily') || normalizedHours.includes('24 hrs')) {
    return {
      isOpen: true,
      isUnverified: false,
      badgeText: 'Open 24 Hours',
      statusColor: 'green',
      openSpan: '24 Hours Daily'
    };
  }

  // Rule 3: Parse standard time ranges
  // Matches e.g. "Daily: 11:00 AM – 12:00 AM (Midnight)", "9:30 PM – 2:00 AM", "5:00 PM - 1:00 AM"
  const timeRegex = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s*[–\-—to]+\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i;
  const match = openingHoursStr.match(timeRegex);

  if (!match) {
    // If not parseable, do not fabricate open status
    return {
      isOpen: false,
      isUnverified: false,
      badgeText: 'Check hours locally',
      statusColor: 'amber',
      disclaimer: openingHoursStr
    };
  }

  const [_, startHStr, startMStr, startMeridiem, endHStr, endMStr, endMeridiem] = match;

  let startH = parseInt(startHStr, 10);
  const startM = startMStr ? parseInt(startMStr, 10) : 0;
  if (startMeridiem.toLowerCase() === 'pm' && startH !== 12) startH += 12;
  if (startMeridiem.toLowerCase() === 'am' && startH === 12) startH = 0;

  let endH = parseInt(endHStr, 10);
  const endM = endMStr ? parseInt(endMStr, 10) : 0;
  if (endMeridiem.toLowerCase() === 'pm' && endH !== 12) endH += 12;
  if (endMeridiem.toLowerCase() === 'am' && endH === 12) endH = 0;

  const startTotalMinutes = startH * 60 + startM;
  const endTotalMinutes = endH * 60 + endM;

  // Calculate current minutes in IST (UTC+5.5)
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istDate = new Date(utc + (3600000 * 5.5));
  const currentTotalMinutes = istDate.getHours() * 60 + istDate.getMinutes();

  let isOpen = false;
  if (startTotalMinutes === endTotalMinutes) {
    // If e.g. 12:00 AM to 12:00 AM
    isOpen = true;
  } else if (startTotalMinutes < endTotalMinutes) {
    // Same day window (e.g. 9:00 AM to 9:00 PM)
    isOpen = currentTotalMinutes >= startTotalMinutes && currentTotalMinutes < endTotalMinutes;
  } else {
    // Overnight window crossing midnight (e.g. 8:00 PM [1200m] to 2:00 AM [120m])
    isOpen = currentTotalMinutes >= startTotalMinutes || currentTotalMinutes < endTotalMinutes;
  }

  const formatTime = (h: number, m: number) => {
    const meridiem = h >= 12 ? 'PM' : 'AM';
    let displayH = h % 12;
    if (displayH === 0) displayH = 12;
    const displayM = m > 0 ? `:${m.toString().padStart(2, '0')}` : ':00';
    return `${displayH}${displayM} ${meridiem}`;
  };

  const endFormatted = formatTime(endH, endM);
  const startFormatted = formatTime(startH, startM);

  if (isOpen) {
    return {
      isOpen: true,
      isUnverified: false,
      badgeText: `Open Now • Closes ${endFormatted}`,
      statusColor: 'green',
      openSpan: `${startFormatted} – ${endFormatted}`
    };
  } else {
    return {
      isOpen: false,
      isUnverified: false,
      badgeText: `Closed • Opens ${startFormatted}`,
      statusColor: 'red',
      openSpan: `${startFormatted} – ${endFormatted}`
    };
  }
}
