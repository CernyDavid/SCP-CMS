import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()
    
    const existingUser = await prisma.user.findUnique({
      where: {
        name: username
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name: username,
        password: hashedPassword
      }
    })

    console.log(`User created: ${user.name}`)

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating user:', error.message)
    }
    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    )
  }
}