import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import SessionProvider from './SessionProvider'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'SCP Foundation',
  description: 'Secure, Contain, Protect',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <Navigation />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  )
}