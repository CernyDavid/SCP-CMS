import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { CreateSCP } from '@/components/CreateSCP'
import { SCPList } from '@/components/SCPList'

async function getClasses() {
  const classes = await prisma.class.findMany({
    orderBy: {
      name: 'asc'
    }
  })
  return classes
}

async function getUserSCPs(userId: string) {
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
  return scps
}

export default async function DashboardPage() {
  const session = await requireAuth()
  
  const [classes, scps] = await Promise.all([
    getClasses(),
    getUserSCPs(session.user.id)
  ])

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      
      <div>
        <SCPList scps={scps} />
      </div>

      <div>
        <CreateSCP classes={classes} />
      </div>
    </div>
  )
}