// src/lib/auth.ts
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcrypt'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        name: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('Authorize called with:', credentials)

        if (!credentials?.name || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        const user = await prisma.user.findUnique({
          where: { name: credentials.name }
        })

        console.log('Found user:', user)

        if (!user) {
          console.log('No user found')
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password, 
          user.password
        )

        console.log('Password valid:', isPasswordValid)

        if (!isPasswordValid) {
          return null
        }

        return { 
          id: user.id, 
          name: user.name 
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT Callback - Token:', token)
      console.log('JWT Callback - User:', user)
      
      if (user) {
        token.id = user.id
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      console.log('Session Callback - Session:', session)
      console.log('Session Callback - Token:', token)
      
      session.user.id = token.id as string
      session.user.name = token.name as string
      return session
    }
  },
  pages: {
    signIn: '/login'
  }
}