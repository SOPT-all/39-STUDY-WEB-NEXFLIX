'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { topics } from './missions';
import { exercises, slides } from './presentation';

type ContentsItem = { path: string; title: string; id?: string };

const groups: { title: string | null; items: ContentsItem[] }[] = [
  { title: null, items: [{ path: '/', title: '발표 시작' }] },
  ...topics.map((topic) => ({
    title: topic.label,
    items: slides.filter((slide) => slide.topic === topic.label)
      .map<ContentsItem>(({ id, title }) => ({ path: '/concepts/' + id, title }))
      .concat(topic.missions.map(({ id, title }) => ({ path: '/lab', id, title }))),
  })),
  { title: '과제 해설', items: exercises.map(({ id, title }) => ({ path: '/mission', id, title })) },
];
const entries = groups.flatMap(({ items }) => items);

export default function PresentationContents() {
  const pathname = usePathname();
  const step = useSearchParams().get('step');
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const visible = open || hovered;

  const current = entries.find((entry) => entry.path === pathname && entry.id === step)
    ?? entries.find(({ path }) => path === pathname);
  if (!current) return null;

  return (
    <div className="presentation-contents"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && visible) {
          setOpen(false);
          setHovered(false);
          trigger.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button ref={trigger} className="contents-trigger" type="button" aria-label="발표 목차"
        aria-controls="presentation-index" aria-expanded={visible}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (!next) setHovered(false);
        }}>
        <span className="contents-icon" aria-hidden="true"><i /><i /><i /></span>
      </button>
      <nav id="presentation-index" aria-label="발표 목차" hidden={!visible}>
        <div className="contents-heading">
          <strong>발표 목차</strong>
          <span>{entries.indexOf(current) + 1} / {entries.length}</span>
        </div>
        <div className="contents-list">
          {groups.map(({ title, items }) => (
            <div className="contents-group" key={title ?? 'home'}>
              {title && <p>{title}</p>}
              <ul>
                {items.map((item) => {
                  const href = item.id ? item.path + '?step=' + item.id : item.path;
                  return (
                    <li key={href}>
                      <Link href={href} aria-current={item === current ? 'page' : undefined}
                        onClick={() => {
                          trigger.current?.focus({ preventScroll: true });
                          setOpen(false);
                          setHovered(false);
                        }}>
                        {item.path === '/lab' && <span className="contents-practice-label">실습</span>}
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
