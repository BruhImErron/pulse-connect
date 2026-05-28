const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createUser() {
  try {
    const passwordHash = await bcrypt.hash('ASDFGHJKL', 12);
    const user = await prisma.user.create({
      data: {
        email: 'erronvillaluz9@gmail.com',
        password: passwordHash,
        name: 'Test User',
      }
    });
    console.log('User created:', user);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();