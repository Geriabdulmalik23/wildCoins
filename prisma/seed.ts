import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding...');

  // 1. Seed kategori produk
  const [gameCategory, eMoneyCategory, pulsaCategory] = await Promise.all([
    prisma.productCategory.upsert({
      where: { name: 'Game' },
      update: {},
      create: { name: 'Game' },
    }),
    prisma.productCategory.upsert({
      where: { name: 'E-Money' },
      update: {},
      create: { name: 'E-Money' },
    }),
    prisma.productCategory.upsert({
      where: { name: 'Pulsa' },
      update: {},
      create: { name: 'Pulsa' },
    }),
  ]);

  // 2. Produk (gunakan create + check manual)
  const createProductIfNotExist = async (name: string, imageUrl: string, description: string, categoryId: number) => {
    let product = await prisma.product.findFirst({ where: { name, categoryId } });
    if (!product) {
      product = await prisma.product.create({
        data: { name, imageUrl, description, categoryId },
      });
    }
    return product;
  };

  const ml = await createProductIfNotExist('Mobile Legends', 'https://example.com/ml.jpg', 'Top up diamond ML', gameCategory.id);
  const ovo = await createProductIfNotExist('OVO', 'https://example.com/ovo.jpg', 'Top up saldo OVO', eMoneyCategory.id);
  const telkomsel = await createProductIfNotExist('Telkomsel', 'https://example.com/telkomsel.jpg', 'Pulsa Telkomsel', pulsaCategory.id);

  // 3. Paket
  await prisma.productPackage.createMany({
    data: [
      {
        productId: ml.id,
        name: '86 Diamonds',
        description: '86 Diamond Mobile Legends',
        price: 20000,
        value: '86 Diamonds',
      },
      {
        productId: ml.id,
        name: '172 Diamonds',
        description: '172 Diamond Mobile Legends',
        price: 40000,
        value: '172 Diamonds',
      },
      {
        productId: ovo.id,
        name: 'OVO 100K',
        description: 'Saldo OVO Rp100.000',
        price: 100000,
        value: '100000',
      },
      {
        productId: telkomsel.id,
        name: 'Pulsa 50K',
        description: 'Pulsa Telkomsel Rp50.000',
        price: 50000,
        value: '50000',
      },
    ],
    skipDuplicates: true,
  });

  // 4. Metode Pembayaran
  await prisma.payment.createMany({
    data: [
      { name: 'QRIS', type: 'E-Wallet', imageUrl: 'https://example.com/qris.jpg' },
      { name: 'Bank Transfer', type: 'Bank', imageUrl: 'https://example.com/bank.jpg' },
      { name: 'OVO', type: 'E-Wallet', imageUrl: 'https://example.com/ovo.jpg' },
    ],
    skipDuplicates: true,
  });

  // 5. Dummy user
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'User Dummy',
      email: 'user@example.com',
      password: 'hashed-password',
    },
  });

  // 6. User Product Account
  let userProductAccount = await prisma.userProductAccount.findFirst({
    where: { userId: user.id, productId: ml.id },
  });

  if (!userProductAccount) {
    userProductAccount = await prisma.userProductAccount.create({
      data: {
        userId: user.id,
        productId: ml.id,
        accountId: '123456789',
        additional: 'Server ID: 1122',
      },
    });
  }

  // 7. Transaksi Dummy
  const selectedPackage = await prisma.productPackage.findFirst({
    where: { productId: ml.id, name: '86 Diamonds' },
  });

  const paymentMethod = await prisma.payment.findFirst({
    where: { name: 'QRIS' },
  });

  if (selectedPackage && paymentMethod) {
    const existingTransaction = await prisma.transaction.findUnique({
      where: { invoiceNumber: 'INV-001' },
    });

    if (!existingTransaction) {
      await prisma.transaction.create({
        data: {
          userId: user.id,
          productPackageId: selectedPackage.id,
          userProductAccountId: userProductAccount.id,
          paymentId: paymentMethod.id,
          totalPrice: selectedPackage.price,
          status: 'SUCCESS',
          invoiceNumber: 'INV-001',
        },
      });
    }
  }

  console.log('✅ Seeding selesai!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding gagal:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });