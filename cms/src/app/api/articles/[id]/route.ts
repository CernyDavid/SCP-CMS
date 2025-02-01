import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/auth'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getCurrentUserId()
    const articleId = params.id

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { authorId: true }
    })

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    if (article.authorId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { 
          status: 403,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    await prisma.article.delete({
      where: { id: articleId }
    })

    return NextResponse.json(
      { message: 'Article deleted successfully' },
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error in DELETE /api/articles/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}