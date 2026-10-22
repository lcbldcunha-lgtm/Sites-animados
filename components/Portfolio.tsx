'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import photos from '@/data/photos.json';
import { BackgroundShutters } from './BackgroundShutters';
import { ScrollTitle, TypeText } from './ScrollTitle';

gsap.registerPlugin(useGSAP, ScrollTrigger);
const categories = ['Todas', 'Natureza', 'Pessoas'] as const;
type Category = typeof categories[number];
type Photo = typeof photos[number];
const imageBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const photoSrc = (src: string) => `${imageBasePath}${src}`;

function RollLink({ href, children }: { href: string; children: string }) {
  return <a href={href} className="roll-link" aria-label={children}><span className="roll-window"><span>{children}</span><span aria-hidden="true">{children}</span></span><span aria-hidden="true">↗</span></a>;
}

export function Portfolio() {
  const scope = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const transition = useRef({ direction: 1, variant: 0 });
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const [category, setCategory] = useState<Category>('Todas');
  const [selected, setSelected] = useState<Photo | null>(null);
  const [previous, setPrevious] = useState<Photo | null>(null);
  const [imageReady, setImageReady] = useState(false);
  const [modalCategory, setModalCategory] = useState<Category>('Todas');
  const [tickerPaused, setTickerPaused] = useState(false);
  const visible = photos.filter(photo => category === 'Todas' || photo.category === category);
  const modalPhotos = photos.filter(photo => modalCategory === 'Todas' || photo.category === modalCategory);
  const mainPhoto = photos.find(photo => photo.source === '20260516092032.jpg') ?? photos[0];
  const smallPhoto = photos.find(photo => photo.source === 'IMG_7130.jpg') ?? photos.find(photo => photo.category === 'Pessoas') ?? photos[0];

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const lenis = new Lenis({ lerp: 0.09, anchors: true });
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      const intro = gsap.timeline({ defaults: { duration: 1, ease: 'power3.out' } });
      intro.from('.collage-card', { y: 65, opacity: 0, stagger: 0.12 }, 0.15)
        .from('.collage-note', { scale: 0.85, opacity: 0 }, 0.5);
      return () => { gsap.ticker.remove(tick); lenis.destroy(); };
    });
    return () => mm.revert();
  }, { scope });

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>('.photo-card').forEach(card => {
        gsap.from(card, { y: 35, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 96%', markers: false } });
      });
    });
    ScrollTrigger.refresh();
    return () => mm.revert();
  }, { scope, dependencies: [category], revertOnUpdate: true });

  useEffect(() => {
    if (!selected) return;
    const node = dialog.current;
    node?.showModal();
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = before; node?.close(); lastTrigger.current?.focus(); };
  }, [Boolean(selected)]); // Keep the dialog open when changing photographs.

  useGSAP(() => {
    if (!selected || !imageReady) return;
    const incoming = dialog.current?.querySelector('[data-photo-current]');
    const outgoing = dialog.current?.querySelector('[data-photo-previous]');
    if (!incoming) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(incoming, { opacity: 1 });
      setPrevious(null);
    });
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const { direction, variant } = transition.current;
      const entries = [
        { x: direction * 85, y: 0, scale: .98, rotation: 0 },
        { x: direction * 22, y: 0, scale: 1.07, rotation: 0 },
        { x: direction * 45, y: 16, scale: .96, rotation: direction * 1.8 },
      ];
      const timeline = gsap.timeline({ defaults: { duration: .65, ease: 'power3.out' }, onComplete: () => setPrevious(null) });
      timeline.fromTo(incoming, { ...entries[variant % entries.length], opacity: 0 }, { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 });
      if (outgoing) timeline.to(outgoing, { x: -direction * 55, opacity: 0, scale: .97, rotation: -direction * .6 }, 0);
    });
    return () => mm.revert();
  }, { scope: dialog, dependencies: [selected?.id, imageReady], revertOnUpdate: true });

  function open(photo: Photo, button: HTMLButtonElement) {
    lastTrigger.current = button;
    setPrevious(null);
    setImageReady(false);
    transition.current = { direction: 1, variant: 1 };
    setModalCategory(visible.some(item => item.id === photo.id) ? category : 'Todas');
    setSelected(photo);
  }
  function close() {
    setSelected(null);
    setPrevious(null);
    setImageReady(false);
    swipeStart.current = null;
  }
  function step(direction: number) {
    if (!selected || !imageReady || modalPhotos.length < 2) return;
    const index = modalPhotos.findIndex(photo => photo.id === selected.id);
    transition.current = { direction, variant: transition.current.variant + 1 };
    setPrevious(selected);
    setImageReady(false);
    setSelected(modalPhotos[(index + direction + modalPhotos.length) % modalPhotos.length]);
  }

  return <div ref={scope} className="portfolio-page">
    <BackgroundShutters />
    <a className="skip-link" href="#galeria" aria-label="Pular para a galeria">Pular para a galeria</a>
    <div className={`ticker${tickerPaused ? ' is-paused' : ''}`} role="region" aria-label="Natureza, pessoas e histórias — fotografias de Lucas Balica">
      <div className="ticker-track" aria-hidden="true">{[0, 1].map(run => <div className="ticker-run" key={run}>{['Natureza, pessoas & histórias', 'Pelo olhar de Lucas Balica', 'Um instante merece ficar', 'Fotografia em movimento'].map(text => <span key={text}>{text}<b>✳</b></span>)}</div>)}</div>
      <button className="ticker-pause" onClick={() => setTickerPaused(value => !value)} aria-label={tickerPaused ? 'Retomar faixa animada' : 'Pausar faixa animada'} aria-pressed={tickerPaused}>{tickerPaused ? '▶' : 'Ⅱ'}</button>
    </div>
    <header className="header">
      <a href="#inicio" className="wordmark" aria-label="Lucas Balica, início"><ScrollTitle as="span" periodic lines={['Lucas', 'Balica.']} /></a>
      <span className="header-name">Fotógrafo<br /><small>Um jeito de ver o mundo</small></span>
      <nav aria-label="Navegação principal"><RollLink href="#galeria">Fotografias</RollLink><RollLink href="#olhar">Meu olhar</RollLink></nav>
    </header>

    <main id="inicio">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-heading"><p className="eyebrow">Olá, pode chegar. O olhar é livre.</p>
          <ScrollTitle as="h1" id="hero-title" periodic lines={['Meu', [{ text: 'portfólio' }, { text: '.', className: 'title-period' }]]} />
          <p className="hero-description">Às vezes, tudo o que a gente precisa<br />é olhar mais <span className="hand-underline">uma vez.<svg viewBox="0 0 200 18" aria-hidden="true"><path d="M3 12Q55 1 100 9T197 6M12 16Q80 8 184 12" /></svg></span></p>
          <a className="hero-explore" href="#galeria" aria-label="Explorar fotografias">Explorar fotografias<span aria-hidden="true">↘</span></a>
        </div>
        <div className="hero-collage" aria-label="Uma pequena seleção do portfólio">
          <span className="collage-spark" aria-hidden="true">✳</span>
          <button className="collage-card collage-main" onClick={event => open(mainPhoto, event.currentTarget)} aria-label={`Ampliar foto de abertura: ${mainPhoto.title}`}><Image src={photoSrc(mainPhoto.src)} alt={mainPhoto.alt} fill sizes="(max-width: 600px) 65vw, 30vw" priority /><span>{mainPhoto.title} ↗</span></button>
          <button className="collage-card collage-small" onClick={event => open(smallPhoto, event.currentTarget)} aria-label={`Ampliar foto de abertura: ${smallPhoto.title}`}><Image src={photoSrc(smallPhoto.src)} alt={smallPhoto.alt} loading="eager" fill sizes="(max-width: 600px) 35vw, 16vw" /><span>O afeto também é paisagem.</span></button>
          <div className="collage-note"><span>{photos.length} fotografias.</span><strong><ScrollTitle as="span" periodic lines={['Infinitas', 'maneiras', 'de sentir.']} /></strong><span aria-hidden="true">↙</span></div>
          <svg className="collage-doodle" viewBox="0 0 200 150" aria-hidden="true"><path d="M25 15C140-15 190 50 145 75S42 48 90 33s128 96 29 103m0 0 20-30m-20 30 36-3" /></svg>
        </div>
        <div className="hero-bottom"><p>Fotografar é prestar atenção.</p><a href="#galeria" aria-label="Role para descobrir">Role para descobrir<span aria-hidden="true">↓</span></a></div>
      </section>

      <section id="galeria" className="gallery-section" aria-labelledby="gallery-title">
        <div className="section-top"><p className="eyebrow"><TypeText text="01 — Fotografias selecionadas" /></p><span className="small-label"><TypeText text="Um instante. Muitas histórias." /></span></div>
        <div className="gallery-title-row"><ScrollTitle id="gallery-title" lines={['Tem vida', [{ text: 'em cada ' }, { text: 'clique.', className: 'title-emphasis' }]]} /><p><TypeText text="Entre o movimento da vida" /><br /><TypeText text="e a beleza de uma pausa." /><br /><span className="gallery-hint"><TypeText text="Clique em uma foto para ampliar" /> ↗</span></p></div>
        <div className="gallery-toolbar"><div className="filters" role="group" aria-label="Filtrar fotografias">{categories.map(item => <button key={item} aria-label={item} aria-pressed={category === item} onClick={() => setCategory(item)}><TypeText text={item} /><span className="filter-count"><TypeText text={String(item === 'Todas' ? photos.length : photos.filter(photo => photo.category === item).length).padStart(2, '0')} /></span></button>)}</div><p className="small-label" aria-live="polite"><TypeText text={`${String(visible.length).padStart(2, '0')} fotografias`} /></p></div>
        <div className="photo-grid">{visible.map(photo => <figure key={photo.id} className="photo-card">
          <button className="photo-button" onClick={event => open(photo, event.currentTarget)} aria-label={`Ampliar: ${photo.title}`}>
            <Image src={photoSrc(photo.src)} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" />
            <span className="photo-open" aria-hidden="true">↗</span>
          </button><figcaption><span><TypeText text={photo.title} /></span><span><TypeText text={photo.category} /></span></figcaption>
        </figure>)}</div>
      </section>

      <section id="olhar" className="about" aria-labelledby="about-title"><p className="eyebrow"><TypeText text="02 — Por trás do olhar" /></p><div className="about-copy"><p className="about-intro"><TypeText text="Muito prazer," /></p><ScrollTitle id="about-title" lines={['Lucas Balica', 'Fotógrafo.']} /><p><TypeText text="Este é meu espaço para compartilhar imagens. Um encontro entre a natureza, as pessoas e os pequenos instantes do cotidiano." /></p><a href="#galeria" className="text-link" aria-label="Voltar às fotografias"><TypeText text="Voltar às fotografias" /><span aria-hidden="true">↗</span></a></div><span className="about-star" aria-hidden="true">✳</span></section>
    </main>
    <footer><p className="eyebrow"><TypeText text="O mundo não para. O olhar fica." /></p><a className="footer-title" href="#galeria"><ScrollTitle as="span" lines={['Olhe de novo.', 'Sinta diferente.']} /><span aria-hidden="true">↗</span></a><div className="footer-bottom"><span><TypeText text="Lucas Balica — Meu portfólio" /></span><a href="#inicio" aria-label="Voltar ao início"><TypeText text="Voltar ao início" /> ↑</a></div></footer>

    <dialog ref={dialog} className="lightbox" aria-label="Fotografia ampliada" onCancel={close}
      onClick={event => { if (!(event.target as Element).closest('.lightbox-photo, button, [data-lightbox-controls] > span')) close(); }}
      onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); step(event.key === 'ArrowRight' ? 1 : -1); } }}>
      {selected && <>
        <div className="lightbox-top" data-lightbox-controls><span><TypeText text={selected.title} once /></span><button autoFocus onClick={close} aria-label="Fechar fotografia"><TypeText text="Fechar" once /> ×</button></div>
        <div className="lightbox-image" onTouchStart={event => {
          if (!(event.target as Element).closest('.lightbox-photo')) return;
          const touch = event.touches[0];
          swipeStart.current = { x: touch.clientX, y: touch.clientY };
        }} onTouchEnd={event => {
          const start = swipeStart.current;
          swipeStart.current = null;
          if (!start) return;
          const touch = event.changedTouches[0];
          const dx = touch.clientX - start.x;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(touch.clientY - start.y) * 1.2) step(dx < 0 ? 1 : -1);
        }}>
          {previous && <div className="lightbox-frame" data-photo-previous aria-hidden="true"><Image className="lightbox-photo" src={photoSrc(previous.src)} alt="" width={previous.width} height={previous.height} sizes="95vw" /></div>}
          <div key={selected.id} className="lightbox-frame" data-photo-current><Image className="lightbox-photo" src={photoSrc(selected.src)} alt={selected.alt} width={selected.width} height={selected.height} sizes="95vw" loading="eager" onLoad={() => setImageReady(true)} onError={() => setImageReady(true)} draggable={false} /></div>
        </div>
        <button className="lightbox-nav lightbox-nav--previous" onClick={() => step(-1)} aria-label="Fotografia anterior"><span className="lightbox-nav-icon" aria-hidden="true">‹</span><span className="lightbox-nav-label"><TypeText text="Anterior" once /></span></button>
        <button className="lightbox-nav lightbox-nav--next" onClick={() => step(1)} aria-label="Próxima fotografia"><span className="lightbox-nav-icon" aria-hidden="true">›</span><span className="lightbox-nav-label"><TypeText text="Próxima" once /></span></button>
        <div className="lightbox-bottom" data-lightbox-controls><span aria-live="polite"><TypeText text={`${modalPhotos.findIndex(photo => photo.id === selected.id) + 1} / ${modalPhotos.length}`} once /></span></div>
      </>}
    </dialog>
  </div>;
}
