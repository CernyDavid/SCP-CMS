
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export type AuthSession = {
  user: {
    id: string
    name?: string | null
  }
} | null

export async function getAuthSession() {
  const session = await getServerSession(authOptions)
  return session as AuthSession
}

export async function requireAuth() {
  const session = await getAuthSession()
  
  if (!session) {
    redirect('/login')
  }
  
  return session
}

export async function getCurrentUserId(): Promise<string> {
  const session = await getAuthSession()
  
  if (!session?.user?.id) {
    throw new Error('Not authenticated')
  }
  
  return session.user.id
}