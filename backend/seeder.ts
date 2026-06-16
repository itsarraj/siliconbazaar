import "dotenv/config";
import products from "./data/products.js";
import users from "./data/users.js";
import prisma from "./lib/prisma.js";

const importData = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to database");

    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    const createdUsers = [];
    for (const userData of users) {
      createdUsers.push(
        await prisma.user.create({
          data: {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            isAdmin: userData.isAdmin ?? false,
            authProvider: "local",
          },
        })
      );
    }

    const adminUser = createdUsers.find((u) => u.isAdmin) ?? createdUsers[0];
    const productResult = await prisma.product.createMany({
      data: products.map((productItem) => ({
        userId: adminUser.id,
        name: productItem.name,
        image: productItem.image,
        price: productItem.price,
        qtyInStock: productItem.qtyInStock,
      })),
    });

    console.log(`Seeded ${createdUsers.length} users and ${productResult.count} products`);
    console.log("");
    console.log("Login credentials:");
    console.log("  admin@example.com / password123  (admin)");
    console.log("  user@example.com / password123   (user)");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

const destroyData = async () => {
  try {
    await prisma.$connect();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    console.log("Data is deleted!");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

if (process.argv[2] === "-d") {
  void destroyData();
} else {
  void importData();
}
