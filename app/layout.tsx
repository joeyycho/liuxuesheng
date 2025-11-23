import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '유학생 준비/생활 도우미',
  description: '해외 유학 준비 체크리스트와 비용 계산기',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}

