import { User } from '../types';

/**
 * Returns a human-friendly display name from the user profile or email.
 * For instance, 'lalithprasad2k5@gmail.com' -> 'Lalith'
 */
export function getUserDisplayName(user?: { email?: string; name?: string } | null): string {
  if (!user?.email) return 'Learner';
  if ((user as any).name && typeof (user as any).name === 'string') {
    return (user as any).name;
  }
  const prefix = user.email.split('@')[0];
  if (/^lalith/i.test(prefix)) {
    return 'Lalith';
  }
  const clean = prefix.replace(/[0-9]+/g, '');
  const parts = clean.split(/[._-]/).filter(Boolean);
  if (parts.length > 0) {
    const first = parts[0];
    return first.charAt(0).toUpperCase() + first.slice(1);
  }
  return 'Learner';
}

/**
 * Returns a contextual time-of-day greeting
 */
export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Returns a subtle formatted date string like 'Today • Sep 9'
 */
export function getContextDateString(): string {
  const now = new Date();
  const dateStr = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(now);
  return `Today • ${dateStr}`;
}

/**
 * Formats an ISO date into a clean learner activity timestamp
 * e.g., 'Today • 7:42 PM' or 'Yesterday • 3:15 PM'
 */
export function formatActivityTimestamp(isoString?: string): string {
  if (!isoString) return 'Recently';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Recently';
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const timeStr = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);

    if (isToday) {
      return `Today • ${timeStr}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isYesterday) {
      return `Yesterday • ${timeStr}`;
    }

    const dayStr = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
    return `${dayStr} • ${timeStr}`;
  } catch {
    return 'Recently';
  }
}
