import { prisma } from '@/lib/prisma'

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
        <h2>All Articles</h2>
        {articles.map((article : any) => (
          <div 
            key={article.id} 
          >
            <h3>
              {article.title}
            </h3>
            <p>
              Category: {article.category.name}
            </p>
            <p>
              By {article.author.name} on {article.createdAt.toLocaleDateString()}
            </p>
            <p>
              {article.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}