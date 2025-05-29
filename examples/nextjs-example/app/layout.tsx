import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Content Harvester Example',
  description: 'Example Next.js app demonstrating the Content Harvester React component library',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-dark-bg-primary">
        {children}
      </body>
    </html>
  );
}