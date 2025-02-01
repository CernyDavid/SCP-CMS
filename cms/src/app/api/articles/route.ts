import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/auth'

export async function GET() {
  try {
    const userId = await getCurrentUserId()
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
    return NextResponse.json(articles)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching articles' }, { status: 500 })
  }
}

export async function POST(req: Request) {
    try {
      const userId = await getCurrentUserId()
      const { title, content, categoryId } = await req.json()
  
      if (!title || !content || !categoryId) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        )
      }
  
      const article = await prisma.article.create({
        data: {
          title,
          content,
          authorId: userId,
          categoryId
        },
        include: {
          category: true
        }
      })
  
      return NextResponse.json({ 
        message: 'Article created successfully',
        article 
      })
  
    } catch (error) {
      console.error('Error creating article:', error)
      return NextResponse.json(
        { error: 'Error creating article' },
        { status: 500 }
      )
    }
  }