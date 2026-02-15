import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mein Garten - Rasenpflege Manager',
  description: 'Professionelle Rasenpflege mit Perfect Green Mähroboter. Verwalte Düngungen, Aussaaten und erhalte wetterbasierte Empfehlungen.',
  applicationName: 'Mein Garten',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Mein Garten',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Mein Garten',
    title: 'Mein Garten - Rasenpflege Manager',
    description: 'Professionelle Rasenpflege mit Perfect Green Mähroboter',
  },
  twitter: {
    card: 'summary',
    title: 'Mein Garten - Rasenpflege Manager',
    description: 'Professionelle Rasenpflege mit Perfect Green Mähroboter',
  },
  icons: {
    icon: [
      { url: '/mein-garten-app/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/mein-garten-app/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/mein-garten-app/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/mein-garten-app/icon-180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/mein-garten-app/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#22c55e',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className="h-full">
      <head>
        <link rel="apple-touch-icon" href="/mein-garten-app/icon-180.png" />
        <link rel="icon" type="image/x-icon" href="/mein-garten-app/favicon.ico" />
        <link rel="icon" type="image/png" sizes="192x192" href="/mein-garten-app/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/mein-garten-app/icon-512.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  )
}