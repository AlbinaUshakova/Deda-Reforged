import { redirect } from 'next/navigation';

export default function BlocksPage({ params }: { params: { episodeId: string } }) {
  redirect(`/play/${params.episodeId}`);
}
