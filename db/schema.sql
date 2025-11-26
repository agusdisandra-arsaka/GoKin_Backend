-- db/schema.sql
-- Run this in your Postgres database to create initial tables for GoKin

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(30),
  email VARCHAR(255),
  name VARCHAR(200),
  password_hash VARCHAR(255),
  role VARCHAR(20) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  name VARCHAR(255),
  category VARCHAR(50),
  description TEXT,
  price JSONB,
  location GEOGRAPHY(Point, 4326),
  address TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES users(id),
  provider_id UUID REFERENCES providers(id),
  items JSONB,
  total_amount NUMERIC,
  status VARCHAR(50) DEFAULT 'requested',
  scheduled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  amount NUMERIC,
  method VARCHAR(50),
  status VARCHAR(50),
  external_id VARCHAR(255),
  payload JSONB,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  customer_id UUID REFERENCES users(id),
  provider_id UUID REFERENCES providers(id),
  rating INT,
  comment TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_providers_location ON providers USING GIST (location);
