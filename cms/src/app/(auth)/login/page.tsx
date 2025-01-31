'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      console.log('Attempting to sign in')
      const result = await signIn('credentials', {
        redirect: false,
        name,
        password
      })

      console.log('Sign in result:', result)

      if (result?.error) {
        console.error('Login error:', result.error)
        setError('Invalid credentials')
      } else {
        router.push('/')
        console.log('Sign in successful')
      }
    } catch (err) {
      console.error('Login catch error:', err)
      setError('An unexpected error occurred')
    }
  }

  return (
    <div>
      <div>
        <div>
          <h2>
            Sign in to your account
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          {error && (
            <div role="alert">
              {error}
            </div>
          )}
          <div>
            <div>
              <label htmlFor="name" className="sr-only">Username</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
            >
              Sign in
            </button>
          </div>

          <div className="text-center">
            <p>
              Don't have an account? {' '}
              <a href="/register">
                Register here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}