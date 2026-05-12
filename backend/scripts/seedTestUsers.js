const bcrypt = require('bcryptjs');
require('dotenv').config();
const prisma = require('../src/lib/prisma');

const users = [
  {
    nom: 'Admin Test',
    email: 'admin@gmail.com',
    password: 'Admin123',
    role: 'Administrateur'
  },
  {
    nom: 'Superviseur Test',
    email: 'superviseur@gmail.com',
    password: 'Superviseur123',
    role: 'Superviseur'
  },
  {
    nom: 'Magasinier Test',
    email: 'magasinier@gmail.com',
    password: 'Magasinier123',
    role: 'Magasinier'
  }
];

(async () => {
  try {
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      const savedUser = await prisma.utilisateur.upsert({
        where: { email: user.email },
        update: {
          nom: user.nom,
          motDePasse: hashedPassword,
          role: user.role
        },
        create: {
          nom: user.nom,
          email: user.email,
          motDePasse: hashedPassword,
          role: user.role
        }
      });

      console.log(`${savedUser.role}: ${savedUser.email}`);
    }

    console.log('Utilisateurs de test prets.');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la creation des utilisateurs de test:', error.message || error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
