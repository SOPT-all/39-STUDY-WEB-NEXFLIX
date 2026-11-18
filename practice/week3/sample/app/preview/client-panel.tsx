'use client';

import { useEffect, useId, useState, type ReactNode } from 'react';

export function ClientPanel({ children, heading }: { children?: ReactNode; heading?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  return (
    <>
      <h2>{heading ?? '참여자 패널'}</h2>
      <button aria-expanded={open} aria-controls={contentId} onClick={() => setOpen(!open)}>
        {open ? '닫기' : '열기'}
      </button>
      <div id={contentId} hidden={!open}>{children ?? <p>전달된 콘텐츠가 없습니다.</p>}</div>
    </>
  );
}

export function Counter({ initialCount = 0, exercise = false, interactive = true, increment = 1, serverCount = 0 }: { initialCount?: number; exercise?: boolean; interactive?: boolean; increment?: number; serverCount?: number }) {
  const [count, setCount] = useState(initialCount);

  return (
    <div className="counter">
      <output aria-label="현재 인원" aria-live="polite">{count}</output>
      <button type="button" onClick={interactive ? () => setCount((value) => value + increment) : undefined}>+1</button>
      {exercise && <small>서버에서 받은 인원 {serverCount}명</small>}
    </div>
  );
}

export function ElapsedDemo({ running }: { running: boolean }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [running]);

  return <output>경과 {seconds}초</output>;
}
