import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { CreateArticle } from '@/components/CreateArticle'
import { ArticleList } from '@/components/ArticleList'

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc'
    }
  })
  return categories
}

async function getUserArticles(userId: string) {
  const articles = await prisma.article.findMany({
    where: {
      authorId: userId
    },
    include: {
      category: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return articles
}

export default async function DashboardPage() {
  const session = await requireAuth()
  
  const [categories, articles] = await Promise.all([
    getCategories(),
    getUserArticles(session.user.id)
  ])

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      
      <div>
        <ArticleList articles={articles} />
      </div>

      <div>
        <CreateArticle categories={categories} />
      </div>
    </div>
  )
}