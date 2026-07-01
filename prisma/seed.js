const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const LOCAL_DB_PATH = path.join(__dirname, '../.local_db.json');

async function main() {
  console.log('Seeding database from .local_db.json...');

  if (!fs.existsSync(LOCAL_DB_PATH)) {
    console.error('Error: .local_db.json not found. Run the app once locally first or ensure the file is present in the project root.');
    process.exit(1);
  }

  const fileContent = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
  const data = JSON.parse(fileContent);

  // Clear existing data to avoid conflicts on duplicate run (order matters for constraints)
  console.log('Cleaning up existing database tables...');
  await prisma.review.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.configuration.deleteMany({});
  await prisma.diamond.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Inserting Users...');
  for (const user of data.users) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        name: user.name,
        role: user.role,
        createdAt: new Date(user.createdAt),
      }
    });
  }

  console.log('Inserting Products...');
  for (const prod of data.products) {
    await prisma.product.create({
      data: {
        id: prod.id,
        title: prod.title,
        description: prod.description,
        category: prod.category,
        material: prod.material,
        price: prod.price,
        image: prod.image,
        thumbnails: prod.thumbnails,
        rating: prod.rating,
        reviewsCount: prod.reviewsCount,
        specs: prod.specs,
        care: prod.care
      }
    });
  }

  console.log('Inserting Reviews...');
  for (const rev of data.reviews) {
    await prisma.review.create({
      data: {
        id: rev.id,
        productId: rev.productId,
        author: rev.author,
        rating: rev.rating,
        comment: rev.comment,
        date: rev.date || ''
      }
    });
  }

  console.log('Inserting Diamonds...');
  if (data.diamonds && Array.isArray(data.diamonds)) {
    for (const dia of data.diamonds) {
      await prisma.diamond.create({
        data: {
          id: dia.id,
          vdbId: dia.vdbId,
          shape: dia.shape,
          carat: dia.carat,
          color: dia.color,
          clarity: dia.clarity,
          cut: dia.cut,
          polish: dia.polish,
          symmetry: dia.symmetry,
          fluorescence: dia.fluorescence,
          certificate: dia.certificate,
          certificateNo: dia.certificateNo,
          certificateUrl: dia.certificateUrl,
          price: dia.price,
          imageUrl: dia.imageUrl,
          videoUrl: dia.videoUrl
        }
      });
    }
  }

  console.log('Inserting Configurations...');
  if (data.configurations && Array.isArray(data.configurations)) {
    for (const cfg of data.configurations) {
      await prisma.configuration.create({
        data: {
          id: cfg.id,
          userId: cfg.userId,
          category: cfg.category,
          shape: cfg.shape,
          setting: cfg.setting,
          metal: cfg.metal,
          size: cfg.size,
          diamondVdbId: cfg.diamondVdbId,
          price: cfg.price,
          createdAt: new Date(cfg.createdAt)
        }
      });
    }
  }

  console.log('Inserting Orders...');
  if (data.orders && Array.isArray(data.orders)) {
    for (const ord of data.orders) {
      const { items, ...header } = ord;
      await prisma.order.create({
        data: {
          id: header.id,
          orderNumber: header.orderNumber,
          userId: header.userId,
          status: header.status,
          total: header.total,
          shippingName: header.shippingName,
          shippingEmail: header.shippingEmail,
          shippingPhone: header.shippingPhone,
          shippingAddress: header.shippingAddress,
          shippingCity: header.shippingCity,
          shippingZip: header.shippingZip,
          paymentId: header.paymentId,
          createdAt: new Date(header.createdAt),
          updatedAt: new Date(header.updatedAt)
        }
      });

      // Insert Order Items if any
      if (items && Array.isArray(items)) {
        for (const itm of items) {
          await prisma.orderItem.create({
            data: {
              id: itm.id,
              orderId: itm.orderId,
              productId: itm.productId,
              diamondId: itm.diamondId,
              customConfigId: itm.customConfigId,
              quantity: itm.quantity,
              price: itm.price
            }
          });
        }
      }
    }
  }

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
