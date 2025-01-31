import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(req: NextRequest) {
  try {
    const { name, password } = await req.json()

    if (!name || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' }, 
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { name }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' }, 
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        password: hashedPassword
      }
    })

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}