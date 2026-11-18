import Link from 'next/link';
import ExerciseEditor from './exercise-editor';

export default async function Page({ searchParams }: { searchParams: Promise<{ step?: string }> }) {
  const { step } = await searchParams;
  return (
    <main className="lab presentation task-page">
      <header className="page-heading">
        <p className="series">넥플릭스 3주차 · 과제 해설</p>
        <h1>과제 정답 맞춰보기</h1>
        <p className="intro-description">미리 작성한 코드를 편집기에 넣고, 오른쪽에서 실행 결과를 확인해 보세요.</p>
      </header>
      <ExerciseEditor step={step} />
      <nav className="intro-next" aria-label="발표 순서">
        <Link className="text-link" href="/concepts/hydration-example">이전</Link>
        <Link className="run start-link" href="/">발표 시작 화면으로</Link>
      </nav>
    </main>
  );
}
