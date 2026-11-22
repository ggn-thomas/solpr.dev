/** Keeps digits and a single decimal point; a comma is read as a point. */
export function sanitizeAmount(input: string): string {
  const cleaned = input.replace(",", ".").replace(/[^\d.]/g, "");
  const [whole, ...decimals] = cleaned.split(".");
  return decimals.length > 0 ? `${whole}.${decimals.join("")}` : whole;
}

/**
 * Reads what was typed as a token amount. In dollar mode the typed value is
 * dollars and is converted with the token price.
 */
export function parseAmount(
  raw: string,
  usdMode: boolean,
  price: number,
): { valid: boolean; tokens: number } {
  const typed = parseFloat(raw);
  const valid = Number.isFinite(typed) && typed > 0;
  if (!valid) return { valid: false, tokens: 0 };
  return { valid: true, tokens: usdMode ? typed / price : typed };
}

/** "$12.30" */
export function formatUsd(value: number): string {
  return `$${value.toFixed(2)}`;
}

/** A token amount with at most six decimals and no trailing zeros. */
export function formatTokenAmount(value: number): string {
  return String(parseFloat(value.toFixed(6)));
}
