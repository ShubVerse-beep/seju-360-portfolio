import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk', display: 'swap' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' })

export const metadata: Metadata = {
  title: 'Sejal Rai — App Developer & XR Creator',
  description:
    'Portfolio of Sejal Manoj Rai: Flutter app developer, AR/VR creator and web designer. Projects, skills, certifications and contact.',
  generator: 'v0.app',
  openGraph: {
    title: 'Sejal Rai — Portfolio 2026',
    description: 'Flutter apps, immersive VR worlds and polished websites.',
    images: ['/images/sejal.jpg'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#07060b',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${grotesk.variable} ${jetbrains.variable} bg-background`}>
      <body>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
