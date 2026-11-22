// TODO(미션 1): 이 컴포넌트는 useState와 onClick을 사용합니다. 파일 맨 위에 무엇을 붙여야 할까요?

import { useState } from 'react';

export default function LikeButton() {
  console.log('[LikeButton] 렌더링');

  const [likes, setLikes] = useState(0);

  return <button onClick={() => setLikes(likes + 1)}>♥ 좋아요 {likes}</button>;
}
