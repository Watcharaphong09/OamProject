import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const BANGKOK_TZ = "Asia/Bangkok";

/**
 * Get current time in Bangkok timezone as ISO string
 */
export function getBangkokNow(): string {
  const now = new Date();
  const bangkokTime = toZonedTime(now, BANGKOK_TZ);
  return bangkokTime.toISOString();
}

/**
 * Format a date string to Thai date (DD/MM/YYYY)
 */
export function formatThaiDate(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    const bangkokDate = toZonedTime(date, BANGKOK_TZ);
    return format(bangkokDate, "dd/MM/yyyy");
  } catch {
    return dateStr;
  }
}

/**
 * Format a date string to time (HH:mm:ss) in Bangkok timezone
 */
export function formatThaiTime(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    const bangkokDate = toZonedTime(date, BANGKOK_TZ);
    return format(bangkokDate, "HH:mm:ss");
  } catch {
    return "";
  }
}

/**
 * Format full datetime
 */
export function formatThaiDateTime(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    const bangkokDate = toZonedTime(date, BANGKOK_TZ);
    return format(bangkokDate, "dd/MM/yyyy HH:mm:ss");
  } catch {
    return dateStr;
  }
}

/**
 * Get relative time label (e.g. "Just now", "5 min ago")
 */
export function getRelativeTime(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "เมื่อกี้";
    if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} ชั่วโมงที่แล้ว`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay} วันที่แล้ว`;
  } catch {
    return "-";
  }
}

/**
 * Class/Grade options
 */
export const GRADE_OPTIONS = [
  "ปวช.1",
  "ปวช.2",
  "ปวช.3",
  "ปวส.1",
  "ปวส.2",
];

/**
 * Validate Student ID format (alphanumeric, exactly 8 chars)
 */
export function isValidStudentId(id: string): boolean {
  return /^[A-Za-z0-9]{8}$/.test(id);
}

/**
 * Get date range for filter presets
 */
export function getDateRange(preset: string): { from: string; to: string } {
  const now = new Date();
  const bangkokNow = toZonedTime(now, BANGKOK_TZ);
  const today = format(bangkokNow, "yyyy-MM-dd");

  switch (preset) {
    case "today":
      return { from: today, to: today };
    case "yesterday": {
      const yesterday = new Date(bangkokNow);
      yesterday.setDate(yesterday.getDate() - 1);
      const y = format(yesterday, "yyyy-MM-dd");
      return { from: y, to: y };
    }
    case "7days": {
      const d = new Date(bangkokNow);
      d.setDate(d.getDate() - 6);
      return { from: format(d, "yyyy-MM-dd"), to: today };
    }
    case "month": {
      const d = new Date(bangkokNow);
      d.setDate(1);
      return { from: format(d, "yyyy-MM-dd"), to: today };
    }
    default:
      return { from: "", to: "" };
  }
}
