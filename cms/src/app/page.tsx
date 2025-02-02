import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function HomePage() {
  const scps = await prisma.sCP.findMany({
    include: { 
      objectClass: true,
      author: { select: { name: true } }
    },
    orderBy: { scpNumber: 'asc' },
    take: 20
  })

  return (
    <div>
      <div className='header'>
      <h1>
        SCP Foundation Hub
      </h1>
      <img className="logo" src="/SCP_logo.png" alt="SCP Foundation logo" />
      <p className='tagline'>Secure. Contain. Protect.</p>
      </div>
      <div className='intro'>
        <p className='welcome'>Welcome to the SCP Foundation Hub. Here you can find information on all anomalous objects, entities and phenomena ever encountered by the Foundation.</p>
        <p className='instructions'>Please note that the site you are currently visiting, along with all other sites connected to the Foundation Intranet (SCiPNet), may contain infohazardous, cognitohazardous, memetic or otherwise hazardous anomalous data.</p>
        <p className='warning'>Further exploration requires at least Level 3 (Secret) security clearance. Attempting to access subsequent files without proper clearance will result in immediate termination of Foundation employement and all benefits associated with it.</p>
      </div>
      <div>
        <h2 className='section-title'>Complete Database of Anomalies</h2>
        <ul className="scp-list">
          {scps.map((scp) => (
            <li key={scp.id} className="scp-container">
              <Link href={`/scps/${scp.id}`} className='scp'>
              <div className="scp__info">
                <h3 className="scp__title">SCP-{scp.scpNumber.toString().padStart(3, '0')}</h3>
                <p className="scp__class">{scp.objectClass.name}</p>
              </div>
              <div className="scp__meta">
                <p className="scp__date">File created on: {new Date(scp.createdAt).toLocaleDateString()}</p>
                <p className="scp__author">File created by: {scp.author.name}</p>
              </div>
              </Link>
            </li>
          ))}
          </ul>
      </div>
    </div>
  )
}