'use client';

import { useState } from 'react';
// TODO(미션 2): MovieList를 직접 import하면 MovieList도 클라이언트 컴포넌트가 됩니다.
// import를 지우고, MovieList를 children으로 받아 보여주도록 바꿔보세요.
import MovieList from './movie-list';

export default function TogglePanel() {
  console.log('[TogglePanel] 렌더링');

  const [open, setOpen] = useState(true);

  return (
    <div>
      <button onClick={() => setOpen(!open)}>{open ? '목록 닫기' : '목록 열기'}</button>
      {open && <MovieList />}
    </div>
  );
}
