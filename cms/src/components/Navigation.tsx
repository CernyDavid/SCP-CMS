'use client'

import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

export default function Navigation() {
  const { data: session } = useSession()

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="space-x-4">
          <Link href="/" className="text-white hover:text-gray-300">
            Home
          </Link>
          {session ? (
            <>
              <Link href="/dashboard" className="text-white hover:text-gray-300">
                Dashboard
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-white hover:text-gray-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white hover:text-gray-300">
                Login
              </Link>
              <Link href="/register" className="text-white hover:text-gray-300">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}