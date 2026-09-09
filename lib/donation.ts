const DEFAULT_DONATION_URL = 'https://www.paypal.com/ncp/payment/RZWAGBDKG8K7Y';

export function getDonationUrl(
  value = process.env.NEXT_PUBLIC_DONATION_URL || DEFAULT_DONATION_URL,
): string | null {
  if (!value) return null;

  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}
