'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { exercises } from '../presentation';

function Editor({ exercise }: { exercise: (typeof exercises)[number] }) {
  const [code, setCode] = useState(exercise.starter);
  const [result, setResult] = useState<{ url: string; run: number } | null>(null);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function execute() {
    setPending(true);
    setResult(null);
    setError('');
    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: exercise.id, code }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
        return;
      }
      setResult({ url: data.preview, run: Date.now() });
    } catch {
      setError('실행 요청을 보내지 못했습니다. 다시 시도해 주세요.');
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <div className="workspace editor-workspace">
        <section className="panel">
          <div className="panel-heading"><label htmlFor="exercise-code">코드 편집기</label><span>TSX</span></div>
          <textarea id="exercise-code" rows={10} maxLength={6000} spellCheck={false}
            value={code} onChange={(event) => setCode(event.target.value)} />
          <button className="run" disabled={pending} onClick={execute}>
            {pending ? '확인 중…' : '컴파일 및 실행'}
          </button>
        </section>
        <section className="panel">
          <h2>실행 결과</h2>
          {error ? <p className="preview-error" role="alert">{error}</p> : result ? (
            <iframe key={result.run} title="과제 실행 결과" src={result.url} />
          ) : (
            <p className="empty" role="status">{pending ? '코드를 확인하는 중이에요.' : '코드를 실행하면 여기에 결과가 표시돼요.'}</p>
          )}
        </section>
      </div>
      <details className="check">
        <summary>예제 코드와 해설</summary>
        <pre><code>{exercise.answer}</code></pre>
        <p>{exercise.explanation}</p>
        <button onClick={() => setCode(exercise.answer)}>편집기에 불러오기</button>
      </details>
    </>
  );
}

export default function ExerciseEditor({ step }: { step?: string }) {
  const router = useRouter();
  const exercise = exercises.find(({ id }) => id === step) ?? exercises[0];
  return (
    <>
      <nav className="missions exercise-tabs" aria-label="과제 선택">
        {exercises.map((item) => (
          <button key={item.id} aria-pressed={item === exercise} onClick={() => router.push('/mission?step=' + item.id, { scroll: false })}>
            {item.title}
          </button>
        ))}
      </nav>
      <Editor key={exercise.id} exercise={exercise} />
    </>
  );
}
