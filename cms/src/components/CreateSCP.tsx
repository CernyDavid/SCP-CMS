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
      setError(err instanceof Error ? err.message : 'Error creating SCP record')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2>Create SCP Record</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>SCP record created successfully</p>}
      <form ref={formRef} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="scpNumber">SCP Number</label>
          <input type="number" id="scpNumber" name="scpNumber" required />
        </div>

        <div>
          <label htmlFor="objectClassId">Object Class</label>
          <select id="objectClassId" name="objectClassId" required>
            <option value="">Select an object class</option>
            {classes.map((objectClass) => (
              <option key={objectClass.id} value={objectClass.id}>
                {objectClass.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="containmentProcedures">Special Containment Procedures</label>
          <textarea id="containmentProcedures" name="containmentProcedures" required rows={5} />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" required rows={5} />
        </div>

        <div>
          <label htmlFor="addenda">Addenda (optional)</label>
          <textarea id="addenda" name="addenda" rows={3} />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  )
}