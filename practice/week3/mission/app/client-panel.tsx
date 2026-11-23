'use client';

import { useState, type ReactNode } from 'react';

export function ClientPanel({ children, heading }: { children?: ReactNode; heading?: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <h2>{heading ?? '참여자 패널'}</h2>
      <button aria-expanded={open} aria-controls="content" onClick={() => setOpen(!open)}>
        {open ? '닫기' : '열기'}
      </button>
      <div id="content" hidden={!open}>{children ?? <p>전달된 콘텐츠가 없습니다.</p>}</div>
    </>
  );
}
