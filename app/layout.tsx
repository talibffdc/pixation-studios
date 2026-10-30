import { Analytics } from '@vercel/analytics/next'
import { Inter, Playfair_Display } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Pixation | Photography, Videography & Content Partner for Interior Designers',
  description: 'Photography, videography and content for interior designers, architects and design studios — working with designers globally.',
  openGraph: {
    title: 'Pixation | Your content partner',
    description: 'More than just a shoot. Your content partner.',
    type: 'website',
  },
  generator: 'v0.app',
  icons: {
    icon: [{ url: '/pixation-favicon.png', type: 'image/png' }],
    apple: [{ url: '/pixation-favicon.png', type: 'image/png' }],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
