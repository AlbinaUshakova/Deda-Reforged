import type { Metadata } from 'next';
import PrivacyPageClient from './PrivacyPageClient';

export const metadata: Metadata = {
  title: 'Приватность - Deda',
  description: 'Как Deda хранит настройки, прогресс и сообщения обратной связи.',
};

export default function PrivacyPage() {
  return <PrivacyPageClient />;
}
