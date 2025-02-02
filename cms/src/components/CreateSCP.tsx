'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Class, CreateSCPInput } from '@/types/types'

type Props = {
  classes: Class[]
}

export function CreateSCP({ classes }: Props) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess(false)

    const formData = new FormData(event.currentTarget)
    const data: CreateSCPInput = {
      scpNumber: Number(formData.get('scpNumber')),
      containmentProcedures: formData.get('containmentProcedures') as string,
      description: formData.get('description') as string,
      addenda: formData.get('addenda') as string || null,
      objectClassId: formData.get('objectClassId') as string,
    }

    try {
      const response = await fetch('/api/scps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create SCP record')
      }

      if (formRef.current) {
        formRef.current.reset()
      }

      setSuccess(true)
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating SCP file.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2 className='section-title'>Create SCP File</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>SCP file created successfully.</p>}
      <form ref={formRef} onSubmit={handleSubmit} className="form">
        <div className="form__group">
          <label htmlFor="scpNumber" className="form__label">
            SCP Number
          </label>
          <input 
            type="number" 
            id="scpNumber" 
            name="scpNumber" 
            required 
            className="form-input"
            min="1"
          />
        </div>

        <div className="form__group">
          <label htmlFor="objectClassId" className="form__label">
            Object Class
          </label>
          <select 
            id="objectClassId" 
            name="objectClassId" 
            required 
            className="form-select"
          >
            <option value="">Select an object class</option>
            {classes.map((objectClass) => (
              <option key={objectClass.id} value={objectClass.id}>
                {objectClass.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form__group">
          <label htmlFor="containmentProcedures" className="form__label">
            Special Containment Procedures
          </label>
          <textarea 
            id="containmentProcedures" 
            name="containmentProcedures" 
            required 
            rows={5} 
            className="form-textarea"
          />
        </div>

        <div className="form__group">
          <label htmlFor="description" className="form__label">
            Description
          </label>
          <textarea 
            id="description" 
            name="description" 
            required 
            rows={5} 
            className="form-textarea"
          />
        </div>

        <div className="form__group">
          <label htmlFor="addenda" className="form__label">
            Addenda (optional)
          </label>
          <textarea 
            id="addenda" 
            name="addenda" 
            rows={3} 
            className="form-textarea"
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading} 
          className="button button--centered"
        >
          {isLoading ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  )
}