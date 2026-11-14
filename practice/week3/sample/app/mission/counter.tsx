'use client';

import { useState } from 'react';

export default function MissionCounter(props: { initialCount: number }) {
  // TODO 3. initialCount로 상태를 초기화하고 클릭할 때 1씩 올리세요.
  const [count] = useState(0);

  return (
    <div className="counter">
      <output aria-label="현재 인원" aria-live="polite">{count}</output>
      <button type="button">+1</button>
      <small>서버에서 받은 인원 {props.initialCount}명</small>
    </div>
  );
}
