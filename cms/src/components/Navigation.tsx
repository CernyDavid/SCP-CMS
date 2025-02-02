'use client'

import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

export default function Navigation() {
  const { data: session } = useSession()

  return (
    <nav>
      <div className="navigation">
        <img className="navigation__logo" src="/SCPHeader.png" alt="SCP Foundation logo" />
        <div className="navigation__links">
          <Link href="/" className='navigation__link'>
            Home
          </Link>
          {session ? (
            <>
              <Link href="/dashboard" className='navigation__link'>
                Dashboard
              </Link>
              <p
                onClick={() => signOut({ callbackUrl: '/login' })} className='navigation__link'
              >
                Logout
              </p>
            </>
          ) : (
            <>
              <Link href="/login" className='navigation__link'>
                Login
              </Link>
              <Link href="/register" className='navigation__link'>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}