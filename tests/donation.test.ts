import assert from 'node:assert/strict';
import test from 'node:test';
import { getDonationUrl } from '../lib/donation.ts';

test('donation link accepts only valid HTTPS addresses', () => {
  assert.equal(getDonationUrl('https://example.com/support'), 'https://example.com/support');
  assert.equal(getDonationUrl('http://example.com/support'), null);
  assert.equal(getDonationUrl('not-a-link'), null);
  assert.equal(getDonationUrl(''), null);
});
