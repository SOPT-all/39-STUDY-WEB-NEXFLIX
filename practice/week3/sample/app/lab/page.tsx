import type { Metadata } from 'next';
import RenderingLab from '../rendering-lab';

export const metadata: Metadata = { title: '넥플릭스 | 블록 실습' };

export default function Page() {
  return <RenderingLab />;
}
