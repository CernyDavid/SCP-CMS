'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function SearchForm({ initialQuery = '' }) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) {
      params.set('query', query)
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="search__form">
      <input
        type="number"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter SCP number (e.g., 173)"
        className="search__input"
        min="1"
      />
      <button type="submit" className="button button--search">
        Search Database
      </button>
    </form>
  )
}