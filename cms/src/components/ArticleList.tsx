'use client'

import { Article } from '@/types/types'

type Props = {
  articles: Article[]
}

export function ArticleList({ articles }: Props) {
  return (
    <div>
      <h2>Your Articles</h2>
      {articles.length === 0 ? (
        <p>No articles yet.</p>
      ) : (
        <ul>
          {articles.map((article) => (
            <li key={article.id}>
              <h3>{article.title}</h3>
              <p>Category: {article.category.name}</p>
              <p>Created: {new Date(article.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}