import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = [
    { name: 'Technology', description: 'Tech-related articles' },
    { name: 'Science', description: 'Scientific discoveries and news' },
    { name: 'Sports', description: 'Sports news and updates' },
    { name: 'Entertainment', description: 'Entertainment news' },
    { name: 'Lifestyle', description: 'Articles about lifestyle' }
  ]

  for (const category of categories) {
    await prisma.category.create({
      data: category
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