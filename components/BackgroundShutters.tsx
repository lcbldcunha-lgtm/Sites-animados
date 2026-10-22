import type { CSSProperties } from 'react';

const phrases = [
  'Junta galera', 'Bora pra foto', 'Todo mundo fala xisss',
  'Olha pra câmera', 'Só mais uma', 'Mais pertinho',
  'Um, dois, três...', 'Agora uma espontânea', 'Não pisca',
  'Segura o sorriso', 'Faz uma pose', 'Agora vale careta',
  'Todo mundo junto', 'Olha o passarinho', 'Mais uma pra garantir',
  'Sorriso natural', 'Um passinho pro lado', 'Essa ficou boa',
  'Capricha no sorriso', 'Agora uma de todo mundo',
];
const tones = ['#b08705', '#ba731b', '#a48128', '#b56b28', '#9d7922'];

export function BackgroundShutters() {
  return <div className="photography-background" aria-hidden="true">
    <div className="background-shutter">
      <svg className="shutter-art" viewBox="0 0 120 120" fill="none" focusable="false">
        <defs><mask id="background-iris" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120" style={{ maskType: 'luminance' }}>
          <rect width="120" height="120" fill="white" />
          <polygon className="shutter-opening" points="60,23 86,34 97,60 86,86 60,97 34,86 23,60 34,34" fill="black" />
        </mask></defs>
        <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="3" />
        <circle cx="60" cy="60" r="47" stroke="currentColor" strokeWidth="1.5" />
        <g mask="url(#background-iris)">
          <circle cx="60" cy="60" r="41" fill="currentColor" fillOpacity=".2" />
          <g className="shutter-blades">{Array.from({ length: 8 }, (_, blade) => <path
            key={blade} transform={`rotate(${blade * 45} 60 60)`}
            d="M60 60Q46 30 60 19A41 41 0 0 1 89 31Q58 35 60 60Z"
            fill="currentColor" fillOpacity={blade % 2 ? '.6' : '.4'} stroke="currentColor" strokeWidth=".8"
          />)}</g>
        </g>
      </svg>
    </div>
    <div className="photo-phrases">{phrases.map((phrase, index) => {
      const duration = 32 + index % 5 * 3;
      return <span key={phrase} className="photo-phrase" style={{
        '--phrase-left': `${8 + index % 5 * 20}%`,
        '--phrase-duration': `${duration}s`,
        '--phrase-delay': `${-duration * (.2 + Math.floor(index / 5) * .19)}s`,
        '--phrase-color': tones[index % 5],
        '--phrase-size': `${[16, 24, 19, 30, 21, 26, 17][index % 7]}px`,
        '--phrase-drift': `${index % 2 ? -35 : 35}px`,
      } as CSSProperties}>{phrase}</span>;
    })}</div>
  </div>;
}
