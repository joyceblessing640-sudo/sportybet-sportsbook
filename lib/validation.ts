const GHANA_PREFIXES: Record<string, string[]> = {
  MTN: ["024", "054", "055", "059"],
  TELECEL: ["020", "050"],
  AIRTELTIGO: ["026", "027", "056", "057"],
};

export function normalizeGhanaPhone(input: string): string | null {
  const digits = input.replace(/[^\d+]/g, "");
  let local = digits;
  if (local.startsWith("+233")) local = `0${local.slice(4)}`;
  else if (local.startsWith("233") && local.length === 12) local = `0${local.slice(3)}`;
  if (!/^0\d{9}$/.test(local)) return null;
  return local;
}

export function detectProvider(phone: string): "MTN" | "TELECEL" | "AIRTELTIGO" | null {
  const normalized = normalizeGhanaPhone(phone);
  if (!normalized) return null;
  const prefix = normalized.slice(0, 3);
  for (const [provider, prefixes] of Object.entries(GHANA_PREFIXES)) {
    if (prefixes.includes(prefix)) return provider as "MTN" | "TELECEL" | "AIRTELTIGO";
  }
  return null;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
}

export function isStrongPassword(password: string): boolean {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

export const PROVIDERS = [
  { id: "MTN", name: "MTN Mobile Money", hint: "024, 054, 055, 059" },
  { id: "TELECEL", name: "Telecel", hint: "020, 050" },
  { id: "AIRTELTIGO", name: "AirtelTigo", hint: "026, 027, 056, 057" },
] as const;
