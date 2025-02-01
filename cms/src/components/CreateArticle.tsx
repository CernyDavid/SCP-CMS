'use client'

import { useState } from 'react'
import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Category, CreateArticleInput } from '@/types/types'

type Props = {
  categories: Category[]
}

export function CreateArticle({ categories }: Props) {
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
      const data: CreateArticleInput = {
        title: formData.get('title') as string,
        content: formData.get('content') as string,
        categoryId: formData.get('categoryId') as string
      }
  
      try {
        const response = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
  
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to create article')
        }
  
        if (formRef.current) {
          formRef.current.reset()
        }
        
        setSuccess(true)
        router.refresh()
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error creating article')
      } finally {
        setIsLoading(false)
      }
    }
  
    return (
      <div>
        <h2>Create New Article</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>Article created successfully</p>}
        <form ref={formRef} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              required
            />
          </div>
  
          <div>
            <label htmlFor="categoryId">Category</label>
            <select id="categoryId" name="categoryId" required>
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
  
          <div>
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              required
              rows={10}
            />
          </div>
  
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Article'}
          </button>
        </form>
      </div>
    )
  }