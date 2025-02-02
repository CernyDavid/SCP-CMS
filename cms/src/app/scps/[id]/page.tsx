'use client'

import { useEffect, useState, use } from 'react'
import { SCP } from '@/types/types'

export default function SCPDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const [scp, setScp] = useState<SCP | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchSCP() {
        try {
            const response = await fetch(`/api/scps/${resolvedParams.id}`)
            if (!response.ok) {
            throw new Error('Failed to fetch SCP')
            }
            const data = await response.json()
            setScp(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load SCP')
        } finally {
            setIsLoading(false)
        }
        }

        fetchSCP()
    }, [resolvedParams.id])

  if (isLoading) {
    return <div className="loading">Loading SCP file...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  if (!scp) {
    return <div className="not-found">SCP file not found.</div>
  }

  return (
    <div className="scp-detail">

      <header className="scp-detail__header">
        <div className="scp-detail__title">
          <h1>SCP-{scp.scpNumber.toString().padStart(3, '0')}</h1>
          <span className="scp-detail__class">Object Class: {scp.objectClass.name}</span>
        </div>
        <div className="scp-detail__meta">
          <p>File created on: {new Date(scp.createdAt).toLocaleDateString()}</p>
        </div>
      </header>

      <div className="scp-detail__content">
        <section className="scp-detail__section">
          <h2>Special Containment Procedures</h2>
          <div className="scp-detail__text">{scp.containmentProcedures}</div>
        </section>

        <section className="scp-detail__section">
          <h2>Description</h2>
          <div className="scp-detail__text">{scp.description}</div>
        </section>

        {scp.addenda && (
          <section className="scp-detail__section">
            <h2>Addenda</h2>
            <div className="scp-detail__text">{scp.addenda}</div>
          </section>
        )}
      </div>
    </div>
  )
}
