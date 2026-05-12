require('dotenv').config();
const prisma = require('./src/lib/prisma');

prisma.$connect()
  .then(() => console.log('CONNECTED'))
  .catch((error) => {
    console.error('CONNECT-ERROR', error.message);
  })
  .finally(() => prisma.$disconnect());
