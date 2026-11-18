import { Suspense } from 'react';
import { connection } from 'next/server';
import { members } from '../missions';
import { ClientPanel, Counter, ElapsedDemo } from './client-panel';

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
  searchParams: Promise<{ mission?: string; block?: string; exercise?: string; message?: string; increment?: string }>;
}) {
  const { mission, block, exercise, message, increment } = await searchParams;
  const added = block === '1';

  if (mission === 'reuse-panels') {
    return (
      <main className="result">
        <section>
          <ClientPanel heading="첫 번째 그룹">
            <MemberList names={members.slice(0, 4)} />
          </ClientPanel>
        </section>
        {added && (
          <section>
            <ClientPanel heading="두 번째 그룹">
              <MemberList names={members.slice(4)} />
            </ClientPanel>
          </section>
        )}
      </main>
    );
  }

  if (mission === 'after-hydration') {
    return <main className="result"><ElapsedDemo running={added} /></main>;
  }

  if (mission === 'composition' || mission === 'slots') {
    return (
      <main className="result">
        <ClientPanel heading={mission === 'slots' && added ? <ServerHeading /> : undefined}>
          {mission === 'slots' || added ? <ServerMemberList /> : undefined}
        </ClientPanel>
      </main>
    );
  }

  if (mission === 'hydration' && exercise !== '1') {
    return (
      <main className="result">
        <ClientPanel><ServerMemberList /></ClientPanel>
      </main>
    );
  }

  if (mission === 'hydration' || mission === 'initial-state') {
    return (
      <main className="result">
        <h2>{mission === 'hydration' ? '카운터' : '참여자 수'}</h2>
        <Counter exercise={exercise === '1'} interactive={exercise !== '1' || added} serverCount={members.length}
          increment={increment && /^[1-9][0-9]?$/.test(increment) ? Number(increment) : 1} initialCount={mission === 'initial-state' && added ? members.length : 0} />
      </main>
    );
  }

  await connection();

  if (mission === 'await-position') {
    const names = added ? null : await readMembers();
    return (
      <main className="result">
        <h2>스터디원 목록</h2>
        <Suspense fallback={<Loading label="스터디원" />}>
          {names ? <MemberList names={names} /> : <SlowMemberList />}
        </Suspense>
      </main>
    );
  }

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
        <Suspense fallback={exercise === '1' ? <p role="status">{message?.slice(0, 100) || '스터디원 불러오는 중…'}</p> : <Loading label="스터디원" />}><SlowMemberList /></Suspense>
      )}
    </main>
  );
}
