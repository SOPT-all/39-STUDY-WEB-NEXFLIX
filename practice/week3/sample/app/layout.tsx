import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = { title: '넥플릭스 | Server & Client Components' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <nav>
          <Link href="/">미션 1~3</Link>
          <Link href="/static">미션 4 · /static</Link>
          <Link href="/dynamic">미션 4 · /dynamic</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
