import "dotenv/config";
import products from "./data/products.js";
import users from "./data/users.js";
import { getPool } from "./lib/db.js";
import {
  clearAllData,
  createProducts,
  createUser,
} from "./lib/repositories.js";

const importData = async () => {
  try {
    await getPool().query("SELECT 1");
    console.log("Connected to database");

    await clearAllData();

    const createdUsers = [];
    for (const userData of users) {
      createdUsers.push(
        await createUser({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          isAdmin: userData.isAdmin ?? false,
          authProvider: "local",
        })
      );
    }

    const adminUser = createdUsers.find((u) => u.isAdmin) ?? createdUsers[0];
    const productCount = await createProducts(
      products.map((productItem) => ({
        userId: adminUser.id,
        name: productItem.name,
        image: productItem.image,
        price: productItem.price,
        qtyInStock: productItem.qtyInStock,
      }))
    );

    console.log(`Seeded ${createdUsers.length} users and ${productCount} products`);
    console.log("");
    console.log("Login credentials:");
    console.log("  admin@example.com / password123  (admin)");
    console.log("  user@example.com / password123   (user)");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await getPool().end();
  }
};

const destroyData = async () => {
  try {
    await getPool().query("SELECT 1");
    await clearAllData();
    console.log("Data is deleted!");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await getPool().end();
  }
};

if (process.argv[2] === "-d") {
  void destroyData();
} else {
  void importData();
}
