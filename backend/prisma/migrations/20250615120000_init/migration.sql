CREATE SCHEMA IF NOT EXISTS "siliconbazaar";

CREATE TYPE "siliconbazaar"."AuthProvider" AS ENUM ('local', 'google');

CREATE TABLE "siliconbazaar"."users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "google_id" TEXT,
    "auth_provider" "siliconbazaar"."AuthProvider" NOT NULL DEFAULT 'local',
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "siliconbazaar"."products" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "qty_in_stock" INTEGER NOT NULL DEFAULT 1,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "siliconbazaar"."orders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "is_payment_done" BOOLEAN NOT NULL DEFAULT false,
    "razorpay_order_id" TEXT,
    "payment_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "siliconbazaar"."order_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "siliconbazaar"."users"("email");
CREATE UNIQUE INDEX "users_google_id_key" ON "siliconbazaar"."users"("google_id");

ALTER TABLE "siliconbazaar"."products" ADD CONSTRAINT "products_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "siliconbazaar"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "siliconbazaar"."orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "siliconbazaar"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "siliconbazaar"."order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "siliconbazaar"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "siliconbazaar"."order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "siliconbazaar"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
