import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mein Garten - Rasenpflege Manager',
  description: 'Professionelle Rasenpflege mit Perfect Green Mähroboter',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}