
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Missing credentials')
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              name: credentials.username
            }
          })

          if (!user) {
            throw new Error('User not found')
          }

          const isPasswordValid = await compare(credentials.password, user.password)

          if (!isPasswordValid) {
            throw new Error('Invalid password')
          }

          return {
            id: user.id,
            name: user.name,
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw error
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt'
  },
  debug: true,
}

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