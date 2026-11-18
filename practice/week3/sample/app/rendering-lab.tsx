'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { members, topics, type Mission } from './missions';

function PreviewFrame({
  mission,
  added,
  label,
  showCode = false,
}: {
  mission: Mission;
  added: boolean;
  label: string;
  showCode?: boolean;
}) {
  const params = new URLSearchParams({ mission: mission.id, block: added ? '1' : '0' });

  return (
    <div className="preview">
      <h3>{label}</h3>
      <iframe
        title={mission.title + ' · ' + label}
        src={'/preview?' + params}
        sandbox={mission.id === 'hydration' && !added ? 'allow-same-origin' : undefined}
      />
      {showCode && <pre className="preview-code"><code>{added ? mission.after : mission.before}</code></pre>}
    </div>
  );
}

export default function RenderingLab({ topic, mission, origin }: {
  topic: (typeof topics)[number];
  mission: Mission;
  origin?: string;
}) {
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [run, setRun] = useState<{ mode: 'single' | 'compare'; added: boolean; count: number } | null>(null);

  const isComparing = run?.mode === 'compare';

  function selectMission(next: Mission) {
    if (next.id === mission.id) return;
    const query = new URLSearchParams({ step: next.id });
    if (origin) query.set('from', origin);
    router.push('/lab?' + query, { scroll: false });
  }

  function execute(mode: 'single' | 'compare') {
    setRun({ mode, added, count: (run?.count ?? 0) + 1 });
  }

  return (
    <main className="lab lab-page">
      <header className="page-heading">
        <div className="lab-heading">
          <p className="series">넥플릭스 3주차</p>
          <nav className="actions" aria-label="학습 페이지">
            <Link href={'/concepts/' + (origin ?? mission.explanationStep)} className="text-link">
              <span aria-hidden="true">← </span>설명으로 돌아가기
            </Link>
            <Link href="/mission" className="text-link">과제 해설</Link>
          </nav>
        </div>
        <h1>블록 실습</h1>
        <p className="intro-description">사전 과제에서 익힌 개념을 새로운 조건에 적용해 보세요. 결과를 예상한 뒤 두 상태를 비교합니다.</p>
      </header>
      <nav aria-label="실습 주제" className="missions">
        {topics.map((item) => (
          <button key={item.label} aria-pressed={item.label === topic.label} onClick={() => selectMission(item.missions[0])}>
            {item.label}
          </button>
        ))}
      </nav>
      <nav aria-label="세부 미션" className="missions tasks">
        {topic.missions.map((item) => (
          <button key={item.id} aria-pressed={item.id === mission.id} onClick={() => selectMission(item)}>
            {item.title}
          </button>
        ))}
      </nav>
      <section className="lab-challenge">
        <h2>{mission.title}</h2>
        <p>{mission.question}</p>
      </section>
      <div className={isComparing ? "workspace comparing" : "workspace"}>
        <section className="panel" aria-labelledby="blocks">
          <h2 id="blocks">블록 조합</h2>
          <button className="block" aria-pressed={added} onClick={() => setAdded(!added)}>
            <span aria-hidden="true">{added ? '−' : '+'}</span> {mission.block}
          </button>
          {!isComparing && <pre><code>{added ? mission.after : mission.before}</code></pre>}
          <div className="actions">
            <button className="run" onClick={() => execute('single')}>실행하기</button>
            <button onClick={() => execute('compare')}>두 결과 비교</button>
          </div>
        </section>
        <section className="panel" aria-labelledby="preview">
          <h2 id="preview">실행 결과</h2>
          {run ? (
            <div key={run.count} className={isComparing ? 'comparison' : undefined}>
              {isComparing ? (
                <>
                  <PreviewFrame mission={mission} added={false} label="기본 상태" showCode />
                  <PreviewFrame mission={mission} added label="블록 추가" showCode />
                </>
              ) : (
                <PreviewFrame mission={mission} added={run.added} label={run.added ? '블록 추가' : '기본 상태'} />
              )}
            </div>
          ) : (
            <p className="empty">결과를 예상한 뒤 실행하거나 두 상태를 나란히 비교해 보세요.</p>
          )}
        </section>
      </div>
      <details key={mission.id} className="check">
        <summary>실행 후 확인할 점</summary>
        <p>{mission.check}</p>
      </details>
      <footer>
        <h2>넥플릭스 스터디원</h2>
        <ul>{members.map((name) => <li key={name}>{name}</li>)}</ul>
      </footer>
    </main>
  );
}
