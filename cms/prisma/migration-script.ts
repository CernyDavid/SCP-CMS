const { PrismaClient: PrismaClientSqlite } = require('@prisma/client');
const { PrismaClient: PrismaClientPostgres } = require('@prisma/client');

async function migrateData() {
  const sqliteClient = new PrismaClientSqlite({
    datasources: {
      db: {
        url: process.env.DATABSE_URL
      }
    }
  });

  const postgresClient = new PrismaClientPostgres({
    datasources: {
      db: {
        url: process.env.POSTGRES_URL
      }
    }
  });

  try {
    // 1. Migrate Classes first (no dependencies)
    console.log('Migrating Classes...');
    const classes = await sqliteClient.class.findMany();
    console.log(`Found ${classes.length} classes`);
    
    if (classes.length > 0) {
      await postgresClient.class.createMany({
        data: classes,
        skipDuplicates: true
      });
    }

    // 2. Migrate Users (no dependencies)
    console.log('Migrating Users...');
    const users = await sqliteClient.user.findMany();
    console.log(`Found ${users.length} users`);
    
    if (users.length > 0) {
      await postgresClient.user.createMany({
        data: users,
        skipDuplicates: true
      });
    }

    // 3. Migrate SCPs (depends on Users and Classes)
    console.log('Migrating SCPs...');
    const scps = await sqliteClient.sCP.findMany();
    console.log(`Found ${scps.length} SCPs`);
    
    if (scps.length > 0) {
      // Handle SCPs one by one due to relations
      for (const scp of scps) {
        await postgresClient.sCP.create({
          data: {
            id: scp.id,
            scpNumber: scp.scpNumber,
            containmentProcedures: scp.containmentProcedures,
            description: scp.description,
            addenda: scp.addenda,
            createdAt: scp.createdAt,
            updatedAt: scp.updatedAt,
            authorId: scp.authorId,
            objectClassId: scp.objectClassId
          }
        });
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await sqliteClient.$disconnect();
    await postgresClient.$disconnect();
  }
}

migrateData();