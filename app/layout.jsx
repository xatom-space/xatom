import './globals.css';

export const metadata = {
  title: 'xatom.space',
  description: 'High-end minimal design studio'
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
