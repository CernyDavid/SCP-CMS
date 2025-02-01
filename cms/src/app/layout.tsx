import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import SessionProvider from './SessionProvider'

export const metadata: Metadata = {
  title: 'Publishing CMS',
  description: 'Stupid CMS for publishing articles',
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