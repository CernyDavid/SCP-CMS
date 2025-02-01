import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  const scps = await prisma.sCP.findMany({
    include: { 
      objectClass: true,
      author: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  })

  return (
    <div>
      <h1>
        My Stupid Next App
      </h1>

      <div>
        <h2>All SCPs</h2>
        <ul>
          {scps.map((scp) => (
            <li key={scp.id}>
              <h3>SCP-{scp.scpNumber.toString().padStart(3, '0')}</h3>
              <p>Object Class: {scp.objectClass.name}</p>
              <p>Record created on: {new Date(scp.createdAt).toLocaleDateString()}</p>
              <p>Author: {scp.author.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}