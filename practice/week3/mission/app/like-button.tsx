'use client';

import { useState } from 'react';

export default function LikeButton() {
  console.log('[LikeButton] 렌더링');

  const [likes, setLikes] = useState(0);

  return <button onClick={() => setLikes(likes + 1)}>♥ 좋아요 {likes}</button>;
}
