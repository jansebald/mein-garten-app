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
    icon: '/app_icon_32x32.ico',
    shortcut: '/app_icon_180x180.png',
    apple: [
      { url: '/app_icon_180x180.png' },
      { url: '/app_icon_180x180.png', sizes: '180x180', type: 'image/png' },
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
        <link rel="apple-touch-icon" href="/app_icon_180x180.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/app_icon_32x32.ico" />
        <link rel="icon" type="image/png" sizes="192x192" href="/app_icon_192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/app_icon_512x512.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}