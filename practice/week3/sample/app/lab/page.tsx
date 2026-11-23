import type { Metadata } from 'next';
import RenderingLab from '../rendering-lab';
import { topics } from '../missions';
import { slides } from '../presentation';

export const metadata: Metadata = { title: '넥플릭스 | 블록 실습' };

export default async function Page({ searchParams }: { searchParams: Promise<{ step?: string; from?: string }> }) {
  const { step, from } = await searchParams;
  const aliases: Record<string, string> = {
    streaming: 'boundaries',
    composition: 'slots',
    'initial-state': 'hydration',
  };
  const selectedStep = step ? aliases[step] ?? step : undefined;
  const topic = topics.find(({ missions }) => missions.some(({ id }) => id === selectedStep)) ?? topics[0];
  const mission = topic.missions.find(({ id }) => id === selectedStep) ?? topic.missions[0];
  const origin = slides.find(({ id }) => id === from)?.id;
  return <RenderingLab key={mission.id} topic={topic} mission={mission} origin={origin} />;
}
