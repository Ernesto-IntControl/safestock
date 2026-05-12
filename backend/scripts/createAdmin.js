const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

const getArg = (name) => {
  const index = process.argv.indexOf(`--${name}`);
  return index !== -1 ? process.argv[index + 1] : undefined;
};

(async () => {
  try {
    const email = getArg('email');
    const password = getArg('password');
    const nom = getArg('name') || 'Administrateur';

    if (!email || !password) {
      console.error('Usage: node scripts/createAdmin.js --email admin@example.com --password secret123 [--name "Admin"]');
      process.exit(1);
    }

    const existing = await prisma.utilisateur.findUnique({ where: { email } });
    if (existing) {
      console.log(`L'utilisateur avec l'email ${email} existe déjà.`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.utilisateur.create({
      data: {
        nom,
        email,
        motDePasse: hashedPassword,
        role: 'Administrateur'
      }
    });

    console.log('Administrateur créé avec succès:', {
      id: user.id,
      nom: user.nom,
      email: user.email,
      role: user.role
    });
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la création de l administrateur:', error.message || error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();