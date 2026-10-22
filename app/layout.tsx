import type { Metadata } from 'next';
import './globals.css';
import 'lenis/dist/lenis.css';

export const metadata: Metadata = {
  title: 'Meu portfólio — Lucas Balica',
  description: 'Fotografias de Lucas Balica. Natureza, encontros e pequenos instantes que merecem ficar.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
