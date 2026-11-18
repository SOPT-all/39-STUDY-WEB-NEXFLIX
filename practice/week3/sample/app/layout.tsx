import type { Metadata } from 'next';
import { Suspense, type ReactNode } from 'react';
import PresentationContents from './presentation-contents';
import './style.css';

export const metadata: Metadata = { title: '넥플릭스 | Rendering Lab' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Suspense><PresentationContents /></Suspense>
      </body>
    </html>
  );
}
