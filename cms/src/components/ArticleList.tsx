'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Article } from '@/types/types'

type Props = {
  articles: Article[]
}

export function ArticleList({ articles: initialArticles }: Props) {
  const router = useRouter()
  const [articles, setArticles] = useState(initialArticles)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete(articleId: string) {
    if (!confirm('Are you sure?')) {
      return
    }

    setIsDeleting(articleId)
    setError(null)

    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error deleting article')
      }

      setArticles(articles.filter(article => article.id !== articleId))
      router.refresh()
    } catch (err) {
      console.error('Error deleting article:', err)
      setError(err instanceof Error ? err.message : 'Error deleting article')
    } finally {
      setIsDeleting(null)
    }
  }

  if (articles.length === 0) {
    return <p>No articles yet.</p>
  }

  return (
    <div>
      <h2>Your Articles</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {articles.map((article) => (
          <li key={article.id} style={{ marginBottom: '1rem' }}>
            <div>
              <h3>{article.title}</h3>
              <p>Category: {article.category.name}</p>
              <p>Created: {new Date(article.createdAt).toLocaleDateString()}</p>
              <button
                onClick={() => handleDelete(article.id)}
                disabled={isDeleting === article.id}>
                {isDeleting === article.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}