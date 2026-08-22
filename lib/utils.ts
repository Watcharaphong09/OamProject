import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const BANGKOK_TZ = "Asia/Bangkok";

/**
 * Get current time in Bangkok timezone as ISO string with correct offset
 */
export function getBangkokNow(): string {
  const now = new Date();
  // Bangkok is UTC+7
  const bangkokOffset = 7 * 60 * 60 * 1000;
  const localOffset = now.getTimezoneOffset() * 60 * 1000;
  
  // We want the string to look like "YYYY-MM-DDTHH:mm:ss+07:00"
  // So we shift the UTC time to Bangkok time, get the ISO string, and replace Z
  const bangkokTime = new Date(now.getTime() + bangkokOffset);
  return bangkokTime.toISOString().replace("Z", "+07:00");
}

/**
 * Format a date string to Thai date (DD/MM/YYYY)
 */
export function formatThaiDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: BANGKOK_TZ,
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Format a date string to time (HH:mm:ss) in Bangkok timezone
 */
export function formatThaiTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: BANGKOK_TZ,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(date);
  } catch {
    return "";
  }
}

/**
 * Format full datetime
 */
export function formatThaiDateTime(dateStr: string): string {
  try {
    return `${formatThaiDate(dateStr)} ${formatThaiTime(dateStr)}`;
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
  const bangkokOffset = 7 * 60 * 60 * 1000;
  const now = new Date();
  const getBangkokDateStr = (date: Date) => {
    // shift to BKK time and get ISO string date part
    const bkkDate = new Date(date.getTime() + bangkokOffset);
    return bkkDate.toISOString().slice(0, 10);
  };
  
  const today = getBangkokDateStr(now);

  switch (preset) {
    case "today":
      return { from: today, to: today };
    case "yesterday": {
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const y = getBangkokDateStr(yesterday);
      return { from: y, to: y };
    }
    case "7days": {
      const d = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
      return { from: getBangkokDateStr(d), to: today };
    }
    case "month": {
      // For month, we need the first day of current BKK month
      const bkkNow = new Date(now.getTime() + bangkokOffset);
      const year = bkkNow.getUTCFullYear();
      const month = String(bkkNow.getUTCMonth() + 1).padStart(2, "0");
      return { from: `${year}-${month}-01`, to: today };
    }
    default:
      return { from: "", to: "" };
  }
}
