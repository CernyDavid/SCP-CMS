import { prisma } from '@/lib/prisma'

async function main() {
  const objectClasses = [
    { 
      name: 'Safe',
      description: 'SCPs that are easily and safely contained'
    },
    { 
      name: 'Euclid',
      description: 'SCPs that require more resources to contain or are unpredictable'
    },
    { 
      name: 'Keter',
      description: 'SCPs that are exceedingly difficult to contain'
    },
    { 
      name: 'Thaumiel',
      description: 'SCPs used to contain other SCPs'
    },
    { 
      name: 'Neutralized',
      description: 'SCPs that are no longer anomalous'
    }
  ]

  for (const objectClass of objectClasses) {
    await prisma.class.create({
      data: objectClass
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })