import { Suspense } from 'react';
import { connection } from 'next/server';
import { members } from '../missions';
import { ClientPanel, Counter } from './client-panel';

async function readMembers(names = members, delay = 2500) {
  await new Promise<void>((resolve) => setTimeout(resolve, delay));
  return names;
}

function MemberList({ names }: { names: string[] }) {
  return <ul className="names">{names.map((name) => <li key={name}>{name}</li>)}</ul>;
}

async function SlowMemberList() {
  return <MemberList names={await readMembers()} />;
}

async function FastGroup() {
  return <section><h2>첫 번째 응답</h2><MemberList names={await readMembers(members.slice(0, 4), 800)} /></section>;
}

async function SlowGroup() {
  return <section><h2>두 번째 응답</h2><MemberList names={await readMembers(members.slice(4))} /></section>;
}

function Loading({ label }: { label: string }) {
  return <p role="status">{label} 불러오는 중…</p>;
}

function ServerMemberList() {
  return <MemberList names={members} />;
}

function ServerHeading() {
  return <>넥플릭스 스터디원 {members.length}명</>;
}

export default async function Preview({
  searchParams,
}: {
  searchParams: Promise<{ mission?: string; block?: string }>;
}) {
  const { mission, block } = await searchParams;
  const added = block === '1';

  if (mission === 'composition' || mission === 'slots') {
    return (
      <main className="result">
        <ClientPanel heading={mission === 'slots' && added ? <ServerHeading /> : undefined}>
          {mission === 'slots' || added ? <ServerMemberList /> : undefined}
        </ClientPanel>
      </main>
    );
  }

  if (mission === 'hydration' || mission === 'initial-state') {
    return (
      <main className="result">
        <h2>{mission === 'hydration' ? '카운터' : '참여자 수'}</h2>
        <Counter initialCount={mission === 'initial-state' && added ? members.length : 0} />
      </main>
    );
  }

  await connection();

  if (mission === 'boundaries') {
    return (
      <main className="result">
        <h2>응답 순서</h2>
        {added ? (
          <>
            <Suspense fallback={<Loading label="첫 번째" />}><FastGroup /></Suspense>
            <Suspense fallback={<Loading label="두 번째" />}><SlowGroup /></Suspense>
          </>
        ) : (
          <Suspense fallback={<Loading label="전체" />}><FastGroup /><SlowGroup /></Suspense>
        )}
      </main>
    );
  }

  const names = added ? null : await readMembers();

  return (
    <main className="result">
      <h2>스터디원 목록</h2>
      {names ? <MemberList names={names} /> : (
        <Suspense fallback={<Loading label="스터디원" />}><SlowMemberList /></Suspense>
      )}
    </main>
  );
}
