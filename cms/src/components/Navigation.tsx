'use client'

import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

export default function Navigation() {
  const { data: session } = useSession()

  return (
    <nav>
      <div>
        <div>
          <Link href="/">
            Home
          </Link>
          {session ? (
            <>
              <Link href="/dashboard">
                Dashboard
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                Login
              </Link>
              <Link href="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}