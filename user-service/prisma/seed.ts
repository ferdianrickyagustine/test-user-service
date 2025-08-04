const { PrismaClient } = require('@prisma/client');
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {

  const adminPassword = await bcrypt.hash('password123', 10);
  
  const employeePassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      email: 'admin@company.com',
      password: adminPassword,
      name: 'Admin User',
      phone: '081234567890',
      position: 'System Administrator',
      role: 'ADMIN',
    },
  });

  const employee = await prisma.user.upsert({
    where: { email: 'employee@company.com' },
    update: {},
    create: {
      email: 'employee@company.com',
      password: employeePassword,
      name: 'Employee User',
      phone: '081234567891',
      position: 'Staff',
      role: 'EMPLOYEE',
    },
  });
  console.log(`Seeding completed for ${admin} and ${employee}`);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })