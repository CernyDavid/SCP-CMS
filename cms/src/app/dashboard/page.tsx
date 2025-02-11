
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
    <div className='dashboard'>
      <h1 className='dashboard__title'>Control Panel</h1>
      <p className='dashboard__intro'>Welcome, researcher {session.user.name}. Here you can view, create and manage your files documenting the anomalous.</p>
      
      <div>
        <SCPList scps={scps} />
      </div>

      <div>
        <CreateSCP classes={classes} />
      </div>
    </div>
  )
}