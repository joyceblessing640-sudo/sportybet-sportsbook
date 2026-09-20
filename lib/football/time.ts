import { FOOTBALL_TZ } from "./types";

export function formatInTimeZone(
  date: Date | string | number,
  timeZone: string,
  options: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat("en-GB", { timeZone, ...options }).format(new Date(date));
}

export function ghanaDate(offsetDays = 0) {
  return calendarDateInZone(FOOTBALL_TZ, offsetDays);
}

export function calendarDateInZone(timeZone: string, offsetDays = 0) {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);
  const utc = Date.UTC(year, month - 1, day + offsetDays);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(utc));
}

export function ymdInZone(date: Date | string, timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
}

export function isGhanaToday(iso: string | Date) {
  return ymdInZone(iso, FOOTBALL_TZ) === ghanaDate(0);
}

export function isGhanaTomorrow(iso: string | Date) {
  return ymdInZone(iso, FOOTBALL_TZ) === ghanaDate(1);
}

export function formatKickoff(iso: string | Date) {
  return formatInTimeZone(iso, FOOTBALL_TZ, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatKickoffDay(iso: string | Date) {
  return formatInTimeZone(iso, FOOTBALL_TZ, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function startOfGhanaDay(offsetDays = 0) {
  const ymd = ghanaDate(offsetDays);
  const [y, m, d] = ymd.split("-").map(Number);
  // Accra is UTC+0 year-round.
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
}

export function formatFixtureDay(iso: string | Date) {
  const day = formatInTimeZone(iso, FOOTBALL_TZ, { day: "2-digit", month: "2-digit" });
  const weekday = formatInTimeZone(iso, FOOTBALL_TZ, { weekday: "long" });
  return `${day} ${weekday}`;
}

export function formatKickoffStamp(iso: string | Date) {
  const day = formatInTimeZone(iso, FOOTBALL_TZ, { day: "2-digit", month: "2-digit" });
  return `${day} ${formatKickoff(iso)}`;
}
