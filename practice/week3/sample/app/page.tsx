import Link from 'next/link';

const concepts = [
  {
    title: 'Streaming & Suspense',
    question: '느린 목록을 기다리는 동안 제목부터 보여줄 수 있을까?',
    explanation: 'Streaming은 서버가 준비된 화면부터 나눠서 보내는 방식입니다. Suspense는 기다리는 영역의 범위와 그동안 보여줄 fallback을 정합니다.',
    example: '스터디원 목록만 Suspense로 감싸면 제목과 로딩 문구가 먼저 보입니다. 목록 두 개에 경계를 각각 두면 먼저 준비된 목록부터 볼 수 있습니다.',
    source: 'https://nextjs.org/docs/app/getting-started/fetching-data#streaming',
  },
  {
    title: 'Composition Patterns',
    question: '서버가 만든 내용을 버튼으로 열고 닫을 수 있을까?',
    explanation: '서버 페이지에서 서버 컴포넌트를 만들어 클라이언트 컴포넌트에 children이나 props로 넘길 수 있습니다. 클라이언트 컴포넌트는 그 내용을 어디에 보여줄지와 열림 상태를 관리합니다.',
    example: '스터디원 목록은 children으로 넘기고, 제목은 heading prop으로 따로 넘겨 같은 패널을 조합합니다.',
    source: 'https://nextjs.org/docs/app/getting-started/server-and-client-components#interleaving-server-and-client-components',
  },
  {
    title: 'Hydration',
    question: '버튼이 화면에 보이면 바로 눌러서 숫자를 바꿀 수 있을까?',
    explanation: '첫 페이지 로드에서는 브라우저가 HTML을 먼저 표시할 수 있습니다. React가 그 HTML에 이벤트 처리 등을 연결하면 클라이언트 컴포넌트가 클릭에 반응합니다.',
    example: '+1 버튼의 HTML은 두 화면에 모두 있습니다. JavaScript가 실행되는 화면에서 버튼을 눌러 숫자가 바뀌는지 확인합니다.',
    source: 'https://nextjs.org/docs/app/getting-started/server-and-client-components#on-the-client-first-load',
  },
];

export default function Page() {
  return (
    <main className="lab intro">
      <header>
        <p className="series">넥플릭스 3주차</p>
        <h1>화면은 어떻게 도착하고 동작할까?</h1>
        <p className="intro-description">
          서버와 클라이언트 컴포넌트의 역할을 살펴봤다면, 이제 화면이 도착하는 순서와
          두 컴포넌트가 한 화면에서 어떻게 동작하는지 확인해 봅시다.
        </p>
      </header>

      <div className="concepts">
        {concepts.map(({ title, question, explanation, example, source }) => (
          <article className="panel concept" key={title}>
            <h2>{title}</h2>
            <p className="concept-question">{question}</p>
            <p>{explanation}</p>
            <p>{example}</p>
            <a href={source} className="text-link" aria-label={title + ' 공식 문서'}>공식 문서</a>
          </article>
        ))}
      </div>

      <div className="intro-next">
        <p>실습에서 결과를 예상하고, 블록을 넣기 전과 후의 코드와 화면을 비교해 보세요.</p>
        <Link href="/lab" className="run start-link">블록 실습 시작</Link>
      </div>
    </main>
  );
}
