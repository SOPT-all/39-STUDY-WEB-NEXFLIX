import Link from 'next/link';
import { connection } from 'next/server';
import { members } from '../missions';
import { ClientPanel } from '../preview/client-panel';
import MissionCounter from './counter';

function MemberList() {
  return <ul>{members.map((name) => <li key={name}>{name}</li>)}</ul>;
}

async function SlowMemberList() {
  await new Promise<void>((resolve) => setTimeout(resolve, 2500));
  return <MemberList />;
}

export default async function Page() {
  await connection();

  return (
    <main className="lab">
      <header className="lab-heading">
        <h1>코드 채우기</h1>
        <Link href="/lab" className="text-link">완성 예제 비교</Link>
      </header>
      <div className="concepts">
        <section className="panel">
          <h2>Streaming &amp; Suspense</h2>
          <p>로딩 문구를 먼저 보여주고 이름 목록은 준비되면 표시하세요.</p>
          {/* TODO 1. SlowMemberList에 Suspense 경계와 fallback을 추가하세요. */}
          <SlowMemberList />
        </section>
        <section className="panel">
          <h2>Composition Patterns</h2>
          <p>열기 버튼을 누르면 스터디원 이름이 표시되도록 조합하세요.</p>
          {/* TODO 2. MemberList를 ClientPanel의 children으로 넘기세요. */}
          <ClientPanel />
        </section>
        <section className="panel">
          <h2>Hydration</h2>
          <p>서버에서 전달한 인원수로 시작하고, +1을 누르면 숫자가 올라가게 하세요.</p>
          <MissionCounter initialCount={members.length} />
        </section>
      </div>
    </main>
  );
}
