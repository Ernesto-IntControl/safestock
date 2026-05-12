require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.$connect()
  .then(() => console.log('CONNECTED'))
  .catch(e => { console.error('CONNECT-ERROR', e.message); })
  .finally(() => prisma.$disconnect());
