import './globals.css';
import { SessionProvider } from 'next-auth/react';

export const metadata = {
  title: 'Next.js App',
  description: 'A Next.js app with Prisma and authentication',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </SessionProvider>
  );
}