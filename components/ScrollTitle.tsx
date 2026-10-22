'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);
type Segment = { text: string; className?: string };
type Props = {
  as?: 'h1' | 'h2' | 'span';
  id?: string;
  lines: (string | Segment[])[];
  periodic?: boolean;
  inline?: boolean;
  once?: boolean;
  pace?: 'slow' | 'normal';
};

export function ScrollTitle({ as: Tag = 'h2', id, lines, periodic = false, inline = false, once = false, pace = 'slow' }: Props) {
  const ref = useRef<HTMLHeadingElement & HTMLSpanElement>(null);
  const label = lines.map(line => typeof line === 'string' ? line : line.map(segment => segment.text).join('')).join(' ');

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const characters = Array.from(el.querySelectorAll<HTMLElement>('.typing-character'));
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const progress = { count: 0 };
      let caret: HTMLElement | undefined;
      let lastCount = -1;
      const render = () => {
        const count = Math.round(progress.count);
        if (count === lastCount) return;
        lastCount = count;
        characters.forEach((character, index) => { character.style.visibility = index < count ? 'visible' : 'hidden'; });
        caret?.classList.remove('typing-caret');
        caret = characters[count - 1];
        caret?.classList.add('typing-caret');
        el.dataset.typedCharacters = String(count);
      };
      render();
      if (once) {
        gsap.to(progress, { count: characters.length, duration: Math.min(1.2, characters.length * .05), ease: 'none', onUpdate: render });
      } else if (periodic) {
        const slow = pace === 'slow';
        gsap.timeline({ repeat: -1, repeatDelay: slow ? 1.5 : .8, delay: .2 })
          .to(progress, { count: characters.length, duration: Math.min(slow ? 4.2 : 2.6, characters.length * (slow ? .14 : .085)), ease: 'none', onUpdate: render })
          .to({}, { duration: slow ? 9 : 4 })
          .to(progress, { count: 0, duration: Math.min(slow ? 2.2 : 1.4, characters.length * (slow ? .075 : .045)), ease: 'none', onUpdate: render });
      } else gsap.to(progress, {
        count: characters.length,
        ease: 'none',
        onUpdate: render,
        scrollTrigger: {
          trigger: el,
          start: 'clamp(top 92%)',
          end: 'clamp(top 52%)',
          scrub: true,
          invalidateOnRefresh: true,
          markers: false,
        },
      });
      return () => {
        characters.forEach(character => { character.style.removeProperty('visibility'); character.classList.remove('typing-caret'); });
        delete el.dataset.typedCharacters;
      };
    });
    return () => mm.revert();
  }, { scope: ref, dependencies: [label, periodic, once, pace], revertOnUpdate: true });

  return <Tag ref={ref} id={id} className={`scroll-title${inline ? ' inline-typing' : ''}`} aria-label={label} data-typing-mode={once ? 'once' : periodic ? 'periodic' : 'scroll'}>
    {lines.map((line, lineIndex) => <span className="typing-line" aria-hidden="true" key={lineIndex}>
      {(typeof line === 'string' ? [{ text: line }] : line).map((segment, segmentIndex) => <span className={segment.className} key={segmentIndex}>
        {segment.text.split(/(\s+)/).map((word, wordIndex) => /^\s+$/.test(word) ? word : <span className="typing-word" key={wordIndex}>{Array.from(word).map((character, characterIndex) => <span className="typing-character" key={characterIndex}>{character}</span>)}</span>)}
      </span>)}
    </span>)}
  </Tag>;
}

export function TypeText({ text, periodic = false, once = false, pace = 'slow' }: { text: string; periodic?: boolean; once?: boolean; pace?: 'slow' | 'normal' }) {
  return <ScrollTitle as="span" inline periodic={periodic} once={once} pace={pace} lines={[text]} />;
}
