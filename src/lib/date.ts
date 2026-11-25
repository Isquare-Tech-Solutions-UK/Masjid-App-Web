/**
 * Date-only helpers.
 *
 * The backend stores event/announcement dates as timezone-less LocalDateTime
 * values and returns them as "YYYY-MM-DDTHH:mm:ss" (no offset). These are
 * wall-clock values, so they must never be routed through toISOString(), which
 * converts to UTC and moves the calendar day for any browser not on UTC
 * (e.g. midnight in IST becomes 18:30 the previous day).
 */

const pad = (n: number) => String(n).padStart(2, '0');

const DATE_PREFIX = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/;

/** Formats a Date's local calendar day as YYYY-MM-DD. */
export function formatLocalDate(d: Date): string {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Today's date in YYYY-MM-DD, in the browser's local timezone. */
export function getLocalTodayDateString(): string {
    return formatLocalDate(new Date());
}

/**
 * Converts a backend date value to YYYY-MM-DD for an <input type="date">,
 * without any timezone conversion. Returns '' if the value can't be parsed.
 */
export function toDateInputValue(value: string | null | undefined): string {
    if (!value) return '';
    const trimmed = value.trim();

    // "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm[:ss]": take the calendar day as-is.
    if (DATE_PREFIX.test(trimmed)) return trimmed.slice(0, 10);

    // Anything else (e.g. a display string): use the local calendar day.
    const d = new Date(trimmed);
    return isNaN(d.getTime()) ? '' : formatLocalDate(d);
}

/**
 * Extracts HH:mm from a backend "YYYY-MM-DDTHH:mm[:ss]" value as-is. Returns ''
 * for any other shape so callers can fall back to their own parsing.
 */
export function toTimeInputValue(value: string | null | undefined): string {
    const match = value?.trim().match(/^\d{4}-\d{2}-\d{2}T(\d{2}:\d{2})/);
    return match ? match[1] : '';
}
