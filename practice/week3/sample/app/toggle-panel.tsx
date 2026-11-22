'use client';

import { useState, type ReactNode } from 'react';

export default function TogglePanel({ children }: { children: ReactNode }) {
  console.log('[TogglePanel] 렌더링');

  const [open, setOpen] = useState(true);

  return (
    <div>
      <button onClick={() => setOpen(!open)}>{open ? '목록 닫기' : '목록 열기'}</button>
      {open && children}
    </div>
  );
}
