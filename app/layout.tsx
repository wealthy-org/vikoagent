import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vikoagent | Sovereign Devnet Paper Trader',
  description: 'Devnet paper trading telemetry and sovereign autonomous agent dashboard.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Vikoagent',
  },
  icons: {
    icon: '/brand/kivo-mark-128.png',
    apple: '/brand/kivo-mark-256.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#0b0e14',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/brand/kivo-mark-256.png" />
      </head>
      <body suppressHydrationWarning>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
