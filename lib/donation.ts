export function getDonationUrl(value = process.env.NEXT_PUBLIC_DONATION_URL): string | null {
  if (!value) return null;

  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}
