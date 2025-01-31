import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function HomePage() {
  const articles = await prisma.article.findMany({
    include: { 
      category: true,
      author: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  })

  return (
    <div>
      <h1>
        My Stupid Next App
      </h1>

      <div>
        {articles.map((article : any) => (
          <div 
            key={article.id} 
          >
            <h2>
              {article.title}
            </h2>
            <p>
              Category: {article.category.name}
            </p>
            <p>
              By {article.author.name} on {article.createdAt.toLocaleDateString()}
            </p>
            <p>
              {article.content.slice(0, 150)}...
            </p>
            <Link 
              href={`/article/${article.id}`} 
            >
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}