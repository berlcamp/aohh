import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AOHH',
  description: 'AOHH',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='bg-black'>
      <ClerkProvider>
        <body className={inter.className}>{children}</body>
      </ClerkProvider>
    </html>
  )
}