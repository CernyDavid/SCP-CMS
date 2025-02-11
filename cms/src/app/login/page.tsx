'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string>('')
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false
      })

      if (result?.error) {
        setError('Invalid credentials')
        return
      }

      router.push('/dashboard')
    } catch (error) {
      if (error instanceof Error) {
        setError('An error occurred: ' + error.message)
      } else {
        setError('An error occurred')
      }
    }
  }

  return (
    <div className='auth'>
      <h1 className='auth__title'>Authorize</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p className='auth__text'>
        Please submit your login credentials. You will temporarily receive Level 3-A (Secret, extended) security clearance required for accessing the Database Control Panel, if you currently have at least Level 2 (Restricted) security clearance.
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
        <button type="submit" className='button button--centered'>Submit</button>
      </form>
    </div>
  )
}