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
    const scpId = params.id

    if (!scpId) {
      return NextResponse.json(
        { error: 'SCP ID is required' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    const scp = await prisma.sCP.findUnique({
      where: { id: scpId },
      select: { authorId: true }
    })

    if (!scp) {
      return NextResponse.json(
        { error: 'SCP not found' },
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    if (scp.authorId !== userId) {
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

    await prisma.sCP.delete({
      where: { id: scpId }
    })

    return NextResponse.json(
      { message: 'SCP deleted successfully' },
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error in DELETE /api/scps/[id]:', error)
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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const scp = await prisma.sCP.findUnique({
      where: { id: params.id },
      include: {
        objectClass: true,
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!scp) {
      return NextResponse.json(
        { error: 'SCP not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(scp)
  } catch (error) {
    console.error('Error fetching SCP:', error)
    return NextResponse.json(
      { error: 'Error fetching SCP' },
      { status: 500 }
    )
  }
}