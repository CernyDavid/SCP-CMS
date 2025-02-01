import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/auth'

export async function GET() {
  try {
    const userId = await getCurrentUserId()
    const scps = await prisma.sCP.findMany({
      where: {
        authorId: userId
      },
      include: {
        objectClass: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(scps)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching SCPs' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserId()
    const { 
      scpNumber,
      containmentProcedures,
      description,
      addenda,
      objectClassId 
    } = await req.json()

    if (!scpNumber || !containmentProcedures || !description || !objectClassId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const scp = await prisma.sCP.create({
      data: {
        scpNumber,
        containmentProcedures,
        description,
        addenda,
        authorId: userId,
        objectClassId
      },
      include: {
        objectClass: true
      }
    })

    return NextResponse.json({ 
      message: 'SCP created successfully',
      scp 
    })

  } catch (error) {
    console.error('Error creating SCP:', error)
    return NextResponse.json(
      { error: 'Error creating SCP' },
      { status: 500 }
    )
  }
}