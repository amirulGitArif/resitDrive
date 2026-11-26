const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const pad = (n: number) => String(n).padStart(2, '0');

/** Local-date YYYY-MM-DD (avoids the UTC shift of toISOString). */
export function toISODate(d: Date = new Date()): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function getCurrentTaxYear(): number {
  return new Date().getFullYear();
}

export function taxYearFromDate(isoDate: string): number {
  const year = parseInt(isoDate.slice(0, 4), 10);
  return Number.isNaN(year) ? getCurrentTaxYear() : year;
}

/** "2026-11-26" -> "26 November 2026" */
export function formatDisplayDate(isoDate: string): string {
  const [y, m, d] = isoDate.slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) {
    return isoDate;
  }
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
