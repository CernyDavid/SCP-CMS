import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  try {
    const { name, password } = await req.json()

    if (!name || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' }, 
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { name }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' }, 
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' }, 
        { status: 401 }
      )
    }

    const token = sign(
      { 
        id: user.id, 
        name: user.name 
      }, 
      process.env.JWT_SECRET || 'your_fallback_secret', 
      { expiresIn: '1h' }
    )

    return NextResponse.json({
      id: user.id,
      name: user.name,
      token
    }, { 
      status: 200,
      headers: {
        'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}