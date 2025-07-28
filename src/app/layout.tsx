import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mein Garten - Rasenpflege Manager',
  description: 'Professionelle Rasenpflege mit Perfect Green Mähroboter',
  manifest: '/manifest.json',
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
  icons: {
    icon: '/mein-garten-app/icon-32.ico',
    shortcut: '/mein-garten-app/icon-180.png',
    apple: [
      { url: '/mein-garten-app/icon-180.png' },
      { url: '/mein-garten-app/icon-180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mein Garten" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <link rel="apple-touch-icon" href="/mein-garten-app/icon-180.png" />
        <link rel="icon" type="image/x-icon" sizes="32x32" href="/mein-garten-app/icon-32.ico" />
        <link rel="icon" type="image/png" sizes="192x192" href="/mein-garten-app/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/mein-garten-app/icon-512.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}