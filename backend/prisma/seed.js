const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with demo accounts, stores, and ratings...');

  // Hash demo passwords
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const userPasswordHash = await bcrypt.hash('User@123', 10);
  const ownerPasswordHash = await bcrypt.hash('Owner@123', 10);

  // 1. Create or update Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'System Administrator Account',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      address: '742 Evergreen Terrace, Administrative HQ, Springfield',
      role: 'ADMIN',
    },
  });

  // 2. Create or update Normal User (Demo)
  const normalUser1 = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Standard Testing Normal User',
      email: 'user@example.com',
      passwordHash: userPasswordHash,
      address: '123 Innovation Boulevard, Suite 400, Austin, TX',
      role: 'USER',
    },
  });

  // 3. Create another Normal User
  const normalUser2 = await prisma.user.upsert({
    where: { email: 'sarah.connor@example.com' },
    update: {},
    create: {
      name: 'Sarah Connor Rating Reviewer',
      email: 'sarah.connor@example.com',
      passwordHash: userPasswordHash,
      address: '456 Cyberdyne Road, West Hollywood, CA',
      role: 'USER',
    },
  });

  // 4. Create Store Owner (Demo)
  const storeOwner1 = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      name: 'Store Owner Representative',
      email: 'owner@example.com',
      passwordHash: ownerPasswordHash,
      address: '500 Market Square, Downtown Commerce Center, Seattle, WA',
      role: 'STORE_OWNER',
    },
  });

  // 5. Create another Store Owner
  const storeOwner2 = await prisma.user.upsert({
    where: { email: 'owner2@example.com' },
    update: {},
    create: {
      name: 'Organic Supermarket Owner',
      email: 'owner2@example.com',
      passwordHash: ownerPasswordHash,
      address: '88 Green Valley Parkway, Boulder, CO',
      role: 'STORE_OWNER',
    },
  });

  // 6. Create Stores
  const store1 = await prisma.store.upsert({
    where: { email: 'support@techgalaxy.com' },
    update: {},
    create: {
      name: 'Tech Galaxy Electronics',
      email: 'support@techgalaxy.com',
      address: '100 Silicon Way, San Jose, CA',
      ownerId: storeOwner1.id,
    },
  });

  const store2 = await prisma.store.upsert({
    where: { email: 'hello@urbanharvest.com' },
    update: {},
    create: {
      name: 'Urban Harvest Organic Market',
      email: 'hello@urbanharvest.com',
      address: '220 Green Street, Seattle, WA',
      ownerId: storeOwner1.id,
    },
  });

  const store3 = await prisma.store.upsert({
    where: { email: 'contact@boulderbooks.com' },
    update: {},
    create: {
      name: 'Boulder Heritage Books',
      email: 'contact@boulderbooks.com',
      address: '88 Pearl Street Mall, Boulder, CO',
      ownerId: storeOwner2.id,
    },
  });

  const store4 = await prisma.store.upsert({
    where: { email: 'info@mountainroast.com' },
    update: {},
    create: {
      name: 'Mountain Peak Coffee Roasters',
      email: 'info@mountainroast.com',
      address: '314 Alpine Avenue, Denver, CO',
      ownerId: storeOwner2.id,
    },
  });

  const store5 = await prisma.store.upsert({
    where: { email: 'care@artisangoods.com' },
    update: {},
    create: {
      name: 'Artisan Goods & Craft Emporium',
      email: 'care@artisangoods.com',
      address: '77 Craft Lane, Portland, OR',
      ownerId: storeOwner1.id,
    },
  });

  // 7. Create Sample Ratings
  // Store 1 ratings
  await prisma.rating.upsert({
    where: {
      userId_storeId: {
        userId: normalUser1.id,
        storeId: store1.id,
      },
    },
    update: { rating: 5 },
    create: {
      userId: normalUser1.id,
      storeId: store1.id,
      rating: 5,
    },
  });

  await prisma.rating.upsert({
    where: {
      userId_storeId: {
        userId: normalUser2.id,
        storeId: store1.id,
      },
    },
    update: { rating: 4 },
    create: {
      userId: normalUser2.id,
      storeId: store1.id,
      rating: 4,
    },
  });

  // Store 2 ratings
  await prisma.rating.upsert({
    where: {
      userId_storeId: {
        userId: normalUser1.id,
        storeId: store2.id,
      },
    },
    update: { rating: 4 },
    create: {
      userId: normalUser1.id,
      storeId: store2.id,
      rating: 4,
    },
  });

  // Store 3 ratings
  await prisma.rating.upsert({
    where: {
      userId_storeId: {
        userId: normalUser2.id,
        storeId: store3.id,
      },
    },
    update: { rating: 5 },
    create: {
      userId: normalUser2.id,
      storeId: store3.id,
      rating: 5,
    },
  });

  // Note: store4 and store5 have no ratings yet, testing the "No ratings yet" condition!

  console.log('Database seeded successfully:');
  console.log(`- Admin: ${admin.email}`);
  console.log(`- Normal User: ${normalUser1.email}`);
  console.log(`- Store Owner: ${storeOwner1.email}`);
  console.log(`- Stores created: 5`);
  console.log(`- Sample ratings created: 4`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
