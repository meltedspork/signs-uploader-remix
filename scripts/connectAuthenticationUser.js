const prismaClient = require('@prisma/client');
const prisma = new prismaClient.PrismaClient();

async function connectAuthenticationUser() {
  const {
    email,
    idProviderUserId,
  } = process.env;

  if (!email || !idProviderUserId) {
    console.log('==========================================================================');
    console.log('npm run user:connect --email="email@email.com" --id="userIdFromIdProvider"');
    console.log('==========================================================================');
  } else {
    console.log('======================================');
    console.log('email:', email);
    console.log('idProviderUserId:', idProviderUserId);
    console.log('======================================');

    const user = await prisma.users.create({
      data: {
        email,
        idProviderUserId
      },
    });

    console.log(`User has been connected. 🪪`, user);
  }
}

connectAuthenticationUser()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });