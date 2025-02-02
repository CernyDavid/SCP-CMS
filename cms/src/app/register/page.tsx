'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string>('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Registration failed')
      }

      router.push('/login')
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An error occurred')
      }
    }
  }

  return (
    <div className='auth'>
      <h1 className='auth__title'>Join the SCiPNet</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p className='auth__text'>
        All new recruits must register for an account. Your account is tied to your security clearance and can be used within the entirety of the Foundation Intranet. Please submit your desired username and password. You need to be at least a Class C personnel to register. If you are a Class D personnel, please contact your Site Director or Vice-director. 
      </p>
      <form onSubmit={handleSubmit} className='form'>
        <div className='form__group'>
          <label htmlFor="username" className='form__label'>Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className='form-input'
            required
          />
        </div>
        <div className='form__group'>
          <label htmlFor="password" className='form__label'>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className='form-input'
            required
          />
        </div>
        <button type="submit" className='button button--centered'>Register</button>
      </form>
    </div>
  )
}