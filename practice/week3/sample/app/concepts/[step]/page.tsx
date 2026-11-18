import Link from 'next/link';
import { notFound } from 'next/navigation';
import { slides } from '../../presentation';

export function generateStaticParams() {
  return slides.map(({ id }) => ({ step: id }));
}

export default async function ConceptPage({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params;
  const index = slides.findIndex(({ id }) => id === step);
  if (index === -1) notFound();

  const slide = slides[index];
  const introduction = slide.body ?? slide.paragraphs?.[0] ?? '';
  const sentenceEnd = introduction.search(/[.!?]\s/);
  const lead = sentenceEnd === -1 ? introduction : introduction.slice(0, sentenceEnd + 1);
  const remaining = sentenceEnd === -1 ? '' : introduction.slice(sentenceEnd + 2);
  const paragraphs = [remaining, ...(slide.paragraphs?.slice(1) ?? [])].filter(Boolean);
  const previous = slides[index - 1];
  const next = slides[index + 1];

  return (
    <main className="lab presentation concept-slide">
      <header className="page-heading">
        <div className="page-meta">
          <p className="series">{slide.topic}</p>
          <span>{index + 1} / {slides.length}</span>
        </div>
        <h1>{slide.title}</h1>

      </header>
      <p className="slide-lead">{lead}</p>
      {paragraphs.length > 0 && (
        <div className="slide-reading">
          {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      )}
      {slide.steps && (
        <ol className="execution-steps">
          {slide.steps.map(({ title, detail, screen }, stepIndex) => (
            <li key={title}>
              <span className="execution-number" aria-hidden="true">{stepIndex + 1}</span>
              <div className="execution-description">
                <h2>{title}</h2>
                <p>{detail}</p>
              </div>
              <div className="execution-screen">
                <span>화면에 보이는 것</span>
                <strong>{screen}</strong>
              </div>
            </li>
          ))}
        </ol>
      )}
      {slide.note && <p className="execution-note">{slide.note}</p>}
      <div className={slide.code && slide.points ? 'concept-content with-code' : 'concept-content'}>
        {slide.code && (
          <section className="example-code" aria-label="코드 예시">
            <div className="code-heading">코드 예시 <span>TSX</span></div>
            <pre><code>{slide.code}</code></pre>
          </section>
        )}
        {slide.points && (
          <section className="concept-points">
            
            <ul className="slide-points">
              {slide.points.map(({ title, detail }) => (
                <li key={title}><strong>{title}</strong><p>{detail}</p></li>
              ))}
            </ul>
          </section>
        )}
      </div>
      {slide.codeNotes && (
        <section className="code-walkthrough" aria-label="코드 설명">
          <h2>코드에서 볼 점</h2>
          <dl>
            {slide.codeNotes.map(({ code, detail }) => (
              <div key={code}>
                <dt><code>{code}</code></dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
      {slide.observation && (
        <aside className="slide-observation" aria-label="실습에서 관찰할 점">
          <div>
            <h2>실습에서 관찰할 점</h2>
            <p>{slide.observation.detail}</p>
          </div>
          <Link className="text-link" href={slide.observation.href + '&from=' + slide.id}>실습 열기 <span aria-hidden="true">↗</span></Link>
        </aside>
      )}
      <nav className="slide-navigation" aria-label="발표 순서">
        <Link className="text-link" href={previous ? '/concepts/' + previous.id : '/'}>← 이전</Link>
        <a className="text-link slide-reference" href={slide.source}>공식 문서 ↗</a>
        <Link className="slide-next" href={next ? '/concepts/' + next.id : '/mission'}>
          <small>다음</small>
          <span>{next ? next.title : '과제 정답 맞춰보기'} <span aria-hidden="true">→</span></span>
        </Link>
      </nav>
    </main>
  );
}
