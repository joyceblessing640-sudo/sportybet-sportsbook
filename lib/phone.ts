import { normalizeGhanaPhone } from "./validation";

/** Accept 024…, +233…, 233…, or the 9-digit local form used after a +233 prefix. */
export function resolveGhanaPhone(input: string): string | null {
  const trimmed = input.trim();
  const direct = normalizeGhanaPhone(trimmed);
  if (direct) return direct;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 9 && /^[235]/.test(digits)) {
    return normalizeGhanaPhone(`0${digits}`);
  }
  return null;
}

export function ghanaLocalNine(phone: string): string {
  const normalized = resolveGhanaPhone(phone);
  return normalized ? normalized.slice(1) : "";
}

export const DEMO_PHONE_LOCAL = "240000001";
export const DEMO_PHONE = "0240000001";
