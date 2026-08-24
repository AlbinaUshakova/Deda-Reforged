import type { Metadata } from 'next';
import SupportPageClient from './SupportPageClient';

export const metadata: Metadata = {
  title: 'Поддержка - Deda',
  description: 'Помощь по обучению, настройкам, звуку и обратной связи в Deda.',
};

export default function SupportPage() {
  return <SupportPageClient />;
}
