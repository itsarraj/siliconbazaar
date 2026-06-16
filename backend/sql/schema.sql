-- SiliconBazaar schema (native PostgreSQL)
-- Apply once against Neon: psql $DATABASE_URL -f sql/schema.sql

CREATE SCHEMA IF NOT EXISTS siliconbazaar;

DO $$ BEGIN
  CREATE TYPE siliconbazaar."AuthProvider" AS ENUM ('local', 'google');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS siliconbazaar.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT,
  google_id TEXT UNIQUE,
  auth_provider siliconbazaar."AuthProvider" NOT NULL DEFAULT 'local',
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS siliconbazaar.products (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES siliconbazaar.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  qty_in_stock INTEGER NOT NULL DEFAULT 1,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS siliconbazaar.orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES siliconbazaar.users(id) ON DELETE CASCADE,
  total_price DECIMAL(10,2) NOT NULL,
  is_payment_done BOOLEAN NOT NULL DEFAULT false,
  razorpay_order_id TEXT,
  payment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS siliconbazaar.order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES siliconbazaar.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES siliconbazaar.products(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  qty INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL
);
