import { randomUUID } from "crypto";
import type { PoolClient } from "pg";
import { getPool, query, SCHEMA } from "./db.js";
import {
  mapOrder,
  mapOrderItem,
  mapProduct,
  mapUser,
} from "./mappers.js";
import type {
  AuthProvider,
  OrderWithRelations,
  Product,
  SafeUser,
  User,
} from "./types.js";

const userColumns =
  "id, name, email, password, google_id, auth_provider, is_admin, created_at, updated_at";

const productColumns =
  "id, user_id, name, image, price, qty_in_stock, is_available, created_at, updated_at";

const orderColumns =
  "id, user_id, total_price, is_payment_done, razorpay_order_id, payment_id, created_at, updated_at";

export const findUserById = async (id: string): Promise<User | null> => {
  const result = await query(
    `SELECT ${userColumns} FROM ${SCHEMA}.users WHERE id = $1`,
    [id]
  );
  return result.rows[0] ? mapUser(result.rows[0]) : null;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await query(
    `SELECT ${userColumns} FROM ${SCHEMA}.users WHERE email = $1`,
    [email]
  );
  return result.rows[0] ? mapUser(result.rows[0]) : null;
};

export const findUserByGoogleId = async (googleId: string): Promise<User | null> => {
  const result = await query(
    `SELECT ${userColumns} FROM ${SCHEMA}.users WHERE google_id = $1`,
    [googleId]
  );
  return result.rows[0] ? mapUser(result.rows[0]) : null;
};

export const createUser = async (data: {
  name: string;
  email: string;
  password?: string | null;
  googleId?: string | null;
  authProvider?: AuthProvider;
  isAdmin?: boolean;
}): Promise<User> => {
  const id = randomUUID();
  const result = await query(
    `INSERT INTO ${SCHEMA}.users
      (id, name, email, password, google_id, auth_provider, is_admin, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
     RETURNING ${userColumns}`,
    [
      id,
      data.name,
      data.email,
      data.password ?? null,
      data.googleId ?? null,
      data.authProvider ?? "local",
      data.isAdmin ?? false,
    ]
  );
  return mapUser(result.rows[0]);
};

export const updateUser = async (
  id: string,
  data: Partial<{
    name: string;
    email: string;
    password: string;
    googleId: string;
    authProvider: AuthProvider;
  }>
): Promise<User> => {
  const current = await findUserById(id);
  if (!current) {
    throw new Error("User not found");
  }

  const result = await query(
    `UPDATE ${SCHEMA}.users
     SET name = $1,
         email = $2,
         password = $3,
         google_id = $4,
         auth_provider = $5,
         updated_at = NOW()
     WHERE id = $6
     RETURNING ${userColumns}`,
    [
      data.name ?? current.name,
      data.email ?? current.email,
      data.password ?? current.password,
      data.googleId ?? current.googleId,
      data.authProvider ?? current.authProvider,
      id,
    ]
  );
  return mapUser(result.rows[0]);
};

export const deleteUser = async (id: string): Promise<void> => {
  await query(`DELETE FROM ${SCHEMA}.users WHERE id = $1`, [id]);
};

export const findUsersExcept = async (excludeId: string): Promise<SafeUser[]> => {
  const result = await query(
    `SELECT id, name, email, google_id, auth_provider, is_admin, created_at, updated_at
     FROM ${SCHEMA}.users
     WHERE id <> $1
     ORDER BY created_at DESC`,
    [excludeId]
  );
  return result.rows.map((row) => {
    const user = mapUser({ ...row, password: null });
    const { password: _password, ...safeUser } = user;
    return safeUser;
  });
};

export const findAvailableProducts = async (
  page: number,
  perPage: number
): Promise<Product[]> => {
  const offset = perPage * (page - 1);
  const result = await query(
    `SELECT ${productColumns}
     FROM ${SCHEMA}.products
     WHERE is_available = true
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [perPage, offset]
  );
  return result.rows.map(mapProduct);
};

export const countAvailableProducts = async (): Promise<number> => {
  const result = await query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM ${SCHEMA}.products WHERE is_available = true`
  );
  return Number(result.rows[0]?.count ?? 0);
};

export const findProductById = async (id: string): Promise<Product | null> => {
  const result = await query(
    `SELECT ${productColumns} FROM ${SCHEMA}.products WHERE id = $1`,
    [id]
  );
  return result.rows[0] ? mapProduct(result.rows[0]) : null;
};

export const findAvailableProductsByIds = async (ids: string[]): Promise<Product[]> => {
  if (ids.length === 0) {
    return [];
  }
  const result = await query(
    `SELECT ${productColumns}
     FROM ${SCHEMA}.products
     WHERE id = ANY($1::text[]) AND is_available = true`,
    [ids]
  );
  return result.rows.map(mapProduct);
};

export const createProduct = async (data: {
  userId: string;
  name: string;
  image: string;
  price: number;
  qtyInStock: number;
}): Promise<Product> => {
  const id = randomUUID();
  const result = await query(
    `INSERT INTO ${SCHEMA}.products
      (id, user_id, name, image, price, qty_in_stock, is_available, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())
     RETURNING ${productColumns}`,
    [id, data.userId, data.name, data.image, data.price, data.qtyInStock]
  );
  return mapProduct(result.rows[0]);
};

export const updateProductAvailability = async (
  id: string,
  isAvailable: boolean
): Promise<Product> => {
  const result = await query(
    `UPDATE ${SCHEMA}.products
     SET is_available = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING ${productColumns}`,
    [isAvailable, id]
  );
  return mapProduct(result.rows[0]);
};

const loadOrderWithRelations = async (
  orderId: string,
  client: PoolClient | null = null
): Promise<OrderWithRelations | null> => {
  const executor = client ?? getPool();
  const orderResult = await executor.query(
    `SELECT o.*, u.id AS u_id, u.name AS u_name, u.email AS u_email
     FROM ${SCHEMA}.orders o
     INNER JOIN ${SCHEMA}.users u ON u.id = o.user_id
     WHERE o.id = $1`,
    [orderId]
  );

  if (orderResult.rows.length === 0) {
    return null;
  }

  const row = orderResult.rows[0];
  const itemsResult = await executor.query(
    `SELECT id, order_id, product_id, name, qty, price
     FROM ${SCHEMA}.order_items
     WHERE order_id = $1`,
    [orderId]
  );

  return {
    ...mapOrder(row),
    user: {
      id: row.u_id as string,
      name: row.u_name as string,
      email: row.u_email as string,
    },
    items: itemsResult.rows.map(mapOrderItem),
  };
};

export const findOrderById = async (id: string): Promise<OrderWithRelations | null> =>
  loadOrderWithRelations(id);

export const findOrdersByUserId = async (userId: string): Promise<OrderWithRelations[]> => {
  const result = await query(
    `SELECT id FROM ${SCHEMA}.orders WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  const orders = await Promise.all(
    result.rows.map((row) => loadOrderWithRelations(row.id as string))
  );
  return orders.filter((order): order is OrderWithRelations => order !== null);
};

export const findAllOrders = async (): Promise<OrderWithRelations[]> => {
  const result = await query(
    `SELECT id FROM ${SCHEMA}.orders ORDER BY created_at DESC`
  );
  const orders = await Promise.all(
    result.rows.map((row) => loadOrderWithRelations(row.id as string))
  );
  return orders.filter((order): order is OrderWithRelations => order !== null);
};

export const createOrderWithItems = async (
  userId: string,
  totalPrice: number,
  items: Array<{
    productId: string;
    name: string;
    qty: number;
    price: number;
  }>
): Promise<OrderWithRelations> => {
  const client = await getPool().connect();
  const orderId = randomUUID();

  try {
    await client.query("BEGIN");

    for (const item of items) {
      await client.query(
        `UPDATE ${SCHEMA}.products
         SET qty_in_stock = qty_in_stock - $1, updated_at = NOW()
         WHERE id = $2`,
        [item.qty, item.productId]
      );
    }

    await client.query(
      `INSERT INTO ${SCHEMA}.orders
        (id, user_id, total_price, is_payment_done, created_at, updated_at)
       VALUES ($1, $2, $3, false, NOW(), NOW())`,
      [orderId, userId, totalPrice]
    );

    for (const item of items) {
      await client.query(
        `INSERT INTO ${SCHEMA}.order_items
          (id, order_id, product_id, name, qty, price)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [randomUUID(), orderId, item.productId, item.name, item.qty, item.price]
      );
    }

    await client.query("COMMIT");

    const order = await loadOrderWithRelations(orderId, client);
    if (!order) {
      throw new Error("Failed to load created order");
    }
    return order;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const updateOrder = async (
  id: string,
  data: Partial<{
    isPaymentDone: boolean;
    razorpayOrderId: string | null;
    paymentId: string | null;
  }>
): Promise<OrderWithRelations> => {
  const current = await findOrderById(id);
  if (!current) {
    throw new Error("Order not found");
  }

  await query(
    `UPDATE ${SCHEMA}.orders
     SET is_payment_done = $1,
         razorpay_order_id = $2,
         payment_id = $3,
         updated_at = NOW()
     WHERE id = $4`,
    [
      data.isPaymentDone ?? current.isPaymentDone,
      data.razorpayOrderId ?? current.razorpayOrderId,
      data.paymentId ?? current.paymentId,
      id,
    ]
  );

  const updated = await findOrderById(id);
  if (!updated) {
    throw new Error("Failed to load updated order");
  }
  return updated;
};

export const clearAllData = async (): Promise<void> => {
  await query(`DELETE FROM ${SCHEMA}.order_items`);
  await query(`DELETE FROM ${SCHEMA}.orders`);
  await query(`DELETE FROM ${SCHEMA}.products`);
  await query(`DELETE FROM ${SCHEMA}.users`);
};

export const createProducts = async (
  products: Array<{
    userId: string;
    name: string;
    image: string;
    price: number;
    qtyInStock: number;
  }>
): Promise<number> => {
  let count = 0;
  for (const product of products) {
    await createProduct(product);
    count += 1;
  }
  return count;
};
