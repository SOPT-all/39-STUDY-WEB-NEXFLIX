import Link from 'next/link';

const agenda = [
  { title: '개념 · 예제 · 블록 실습', description: '로딩 경계 · 제목 슬롯 · JavaScript 유무 비교', href: '/concepts/streaming' },
  { title: '과제 해설', description: '미리 풀어 온 코드를 입력하고 실행하기', href: '/mission' },
];

export default function Page() {
  return (
    <main className="lab cover">
      <header className="cover-hero">
        <p className="series">넥플릭스 3주차 · Rendering</p>
        <h1>화면은 어떻게 도착하고<br />동작할까?</h1>
        <p className="intro-description">스터디원 목록이 브라우저에 도착하는 순간부터, 화면에 보이는 버튼이 클릭에 반응하기까지 살펴봅니다.</p>
        <Link href="/concepts/streaming" className="run start-link">발표 시작 <span aria-hidden="true">→</span></Link>
      </header>
      <nav className="cover-agenda" aria-label="발표 순서">
        <h2>진행 순서</h2>
        <ol>
          {agenda.map(({ title, description, href }, index) => (
            <li key={href}>
              <Link href={href}>
                <span className="agenda-number" aria-hidden="true">0{index + 1}</span>
                <span><strong>{title}</strong><small>{description}</small></span>
                <span className="agenda-arrow" aria-hidden="true">↗</span>
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </main>
  );
}
