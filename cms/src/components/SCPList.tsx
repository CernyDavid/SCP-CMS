'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SCP } from '@/types/types'

type Props = {
  scps: SCP[]
}

export function SCPList({ scps: initialScps }: Props) {
  const router = useRouter()
  const [scps, setScps] = useState(initialScps)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete(scpId: string) {
    if (!confirm('Are you sure you want to delete this SCP?')) {
      return
    }

    setIsDeleting(scpId)
    setError(null)

    try {
      const response = await fetch(`/api/scps/${scpId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error deleting SCP')
      }

      setScps(scps.filter(scp => scp.id !== scpId))
      router.refresh()
    } catch (err) {
      console.error('Error deleting SCP:', err)
      setError(err instanceof Error ? err.message : 'Error deleting SCP')
    } finally {
      setIsDeleting(null)
    }
  }

  if (scps.length === 0) {
    return (<div>
    <h2 className='section-title'>Your Files</h2>
    <p className='no-records'>No records yet.</p>
    </div>)
  }

  return (
    <div>
      <h2 className='section-title'>Your Files</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul className='scp-list'>
        {scps.map((scp) => (
          <li key={scp.id}>
            <div>
              <h3>SCP-{scp.scpNumber.toString().padStart(3, '0')}</h3>
              <p>Object Class: {scp.objectClass.name}</p>
              <p>Created on: {new Date(scp.createdAt).toLocaleDateString()}</p>
              <div>
                <button className='button button--delete'
                  onClick={() => handleDelete(scp.id)}
                  disabled={isDeleting === scp.id}
                >
                  {isDeleting === scp.id ? 'Terminating...' : 'Delete'}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}