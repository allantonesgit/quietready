-- ============================================================
-- QuietReady.ai — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ============================================================
-- CUSTOMERS
-- Core account record. Created at end of onboarding.
-- ============================================================
CREATE TABLE customers (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id          UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email                 TEXT NOT NULL UNIQUE,
  full_name             TEXT,
  phone                 TEXT,
  stripe_customer_id    TEXT UNIQUE,
  billing_customer_id   TEXT UNIQUE,   -- ID in billing.quietready.ai
  status                TEXT NOT NULL DEFAULT 'onboarding'
                          CHECK (status IN ('onboarding','active','paused','cancelled')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- HOUSEHOLD
-- Who we are feeding — one row per customer
-- ============================================================
CREATE TABLE household (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id   UUID NOT NULL UNIQUE REFERENCES customers(id) ON DELETE CASCADE,
  infants       INT NOT NULL DEFAULT 0,
  children      INT NOT NULL DEFAULT 0,  -- age 2-12
  teens         INT NOT NULL DEFAULT 0,  -- age 13-17
  adults        INT NOT NULL DEFAULT 0,  -- age 18-64
  seniors       INT NOT NULL DEFAULT 0,  -- age 65+
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PETS
-- One row per pet type per customer
-- ============================================================
CREATE TABLE pets (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id   UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  pet_type      TEXT NOT NULL CHECK (pet_type IN ('dog','cat','bird','small_animal','fish','reptile','horse','other')),
  count         INT NOT NULL DEFAULT 0,
  size          TEXT CHECK (size IN ('Small','Medium','Large')),  -- dogs only
  food_brand    TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CUSTOMER PREFERENCES
-- Full onboarding questionnaire answers — one row per customer
-- ============================================================
CREATE TABLE customer_preferences (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id           UUID NOT NULL UNIQUE REFERENCES customers(id) ON DELETE CASCADE,

  -- Food philosophy
  food_philosophy       TEXT NOT NULL DEFAULT 'balanced'
                          CHECK (food_philosophy IN ('wholeFood','balanced','freezeDried','noPreference')),

  -- Dietary restrictions (stored as JSONB for flexibility)
  -- e.g. {"vegetarian": true, "glutenFree": true, "nutAllergy": true}
  dietary_restrictions  JSONB NOT NULL DEFAULT '{}',
  dietary_notes         TEXT,

  -- Ingredient avoidances
  food_avoidances       JSONB NOT NULL DEFAULT '{}',

  -- Coverage goal
  coverage_months       NUMERIC(4,1) NOT NULL DEFAULT 3,  -- supports 0.5 (2 weeks) through 12

  -- Monthly budget
  monthly_budget        INT NOT NULL DEFAULT 150,

  -- Storage space
  storage_length_ft     NUMERIC(6,2),
  storage_width_ft      NUMERIC(6,2),
  storage_height_ft     NUMERIC(6,2),
  storage_max_stack_ft  NUMERIC(6,2),
  storage_type          TEXT CHECK (storage_type IN ('basement','closet','garage','pantry','shed','multiple')),

  -- Utilities
  utilities             JSONB NOT NULL DEFAULT '{}',
  -- e.g. {"cityWater": true, "gasStove": true, "generator": false}

  -- Equipment selected
  equipment             JSONB NOT NULL DEFAULT '{}',

  -- Container tier chosen
  container_tier        TEXT CHECK (container_tier IN ('good','better','best','none')),

  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- STORAGE CONTAINERS
-- Physical containers assigned to a customer.
-- Container codes like "A-1", "B-3" are printed on labels.
-- ============================================================
CREATE TABLE storage_containers (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id         UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  container_code      TEXT NOT NULL,   -- e.g. "A-1", "B-4"
  tier                TEXT NOT NULL CHECK (tier IN ('good','better','best')),
  location_zone       TEXT,            -- e.g. "Basement north wall"
  is_pet_container    BOOLEAN NOT NULL DEFAULT FALSE,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (customer_id, container_code)
);

-- ============================================================
-- INVENTORY ITEMS
-- Every product tracked in a customer's storage.
-- Created/updated when shipments are confirmed.
-- ============================================================
CREATE TABLE inventory_items (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id         UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  container_id        UUID REFERENCES storage_containers(id),
  product_name        TEXT NOT NULL,
  category            TEXT NOT NULL,   -- Grains, Protein, Vegetables, etc.
  supplier            TEXT,
  brand               TEXT,
  qty_on_hand         NUMERIC(10,2) NOT NULL DEFAULT 0,
  unit                TEXT NOT NULL,   -- "cans", "lbs", "liters", etc.
  unit_size           TEXT,            -- e.g. "15oz", "25 lb bag"
  expiry_date         DATE,
  replenish_by_date   DATE,
  status              TEXT NOT NULL DEFAULT 'full'
                        CHECK (status IN ('full','partial','empty','expired')),
  rotation_status     TEXT NOT NULL DEFAULT 'ok'
                        CHECK (rotation_status IN ('ok','rotate_soon','overdue')),
  is_pet_food         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ORDERS
-- One order per monthly purchasing cycle.
-- ============================================================
CREATE TABLE orders (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id           UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  order_number          TEXT NOT NULL UNIQUE,   -- e.g. "QR-2024-001234"
  order_date            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  product_cost          NUMERIC(10,2) NOT NULL DEFAULT 0,
  markup_amount         NUMERIC(10,2) NOT NULL DEFAULT 0,
  membership_fee        NUMERIC(10,2) NOT NULL DEFAULT 30.00,
  total_billed          NUMERIC(10,2) NOT NULL DEFAULT 0,
  status                TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','purchasing','shipped','partially_delivered','complete','cancelled')),
  stripe_payment_id     TEXT,
  billing_invoice_id     TEXT,
  billing_invoice_number TEXT,
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ORDER ITEMS
-- Individual products within an order — one per supplier line.
-- confirmed_at triggers the portal placement instructions.
-- ============================================================
CREATE TABLE order_items (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id            UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  customer_id         UUID NOT NULL REFERENCES customers(id),
  inventory_item_id   UUID REFERENCES inventory_items(id),
  product_name        TEXT NOT NULL,
  supplier            TEXT NOT NULL,
  supplier_order_id   TEXT,
  product_url         TEXT,
  qty                 NUMERIC(10,2) NOT NULL,
  unit                TEXT NOT NULL,
  unit_cost           NUMERIC(10,2) NOT NULL,
  total_cost          NUMERIC(10,2) NOT NULL,
  tracking_number     TEXT,
  shipped_at          TIMESTAMPTZ,
  confirmed_at        TIMESTAMPTZ,   -- SET BY ADMIN when customer confirms receipt
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SHIPMENT INSTRUCTIONS
-- Generated when confirmed_at is set on an order_item.
-- Customer sees these in portal: "Put this item in container X-3"
-- ============================================================
CREATE TABLE shipment_instructions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id         UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  order_item_id       UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  container_id        UUID REFERENCES storage_containers(id),
  container_code      TEXT NOT NULL,   -- denormalized for display
  product_name        TEXT NOT NULL,
  instruction_text    TEXT NOT NULL,
  label_text          TEXT NOT NULL,   -- what to print on the label
  is_acknowledged     BOOLEAN NOT NULL DEFAULT FALSE,
  acknowledged_at     TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PDF DOCUMENTS
-- Tracks generated Recipe/Inventory PDF versions per customer.
-- Regenerated each time a shipment is confirmed.
-- ============================================================
CREATE TABLE customer_pdfs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id     UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  pdf_type        TEXT NOT NULL DEFAULT 'recipe_guide'
                    CHECK (pdf_type IN ('recipe_guide','inventory','rotation_schedule')),
  version         INT NOT NULL DEFAULT 1,
  storage_path    TEXT NOT NULL,   -- Supabase Storage or S3 path
  generated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  triggered_by    TEXT,            -- "shipment_confirmed", "manual", etc.
  is_current      BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================================
-- ADMIN USERS
-- Internal team — separate from customer auth
-- ============================================================
CREATE TABLE admin_users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id  UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL UNIQUE,
  full_name     TEXT,
  role          TEXT NOT NULL DEFAULT 'staff'
                  CHECK (role IN ('owner','manager','staff')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- INDEXES — performance on the most common query patterns
-- ============================================================
CREATE INDEX idx_customers_auth_user     ON customers(auth_user_id);
CREATE INDEX idx_customers_email         ON customers(email);
CREATE INDEX idx_customers_status        ON customers(status);
CREATE INDEX idx_household_customer      ON household(customer_id);
CREATE INDEX idx_pets_customer           ON pets(customer_id);
CREATE INDEX idx_prefs_customer          ON customer_preferences(customer_id);
CREATE INDEX idx_containers_customer     ON storage_containers(customer_id);
CREATE INDEX idx_inventory_customer      ON inventory_items(customer_id);
CREATE INDEX idx_inventory_container     ON inventory_items(container_id);
CREATE INDEX idx_inventory_expiry        ON inventory_items(expiry_date);
CREATE INDEX idx_inventory_replenish     ON inventory_items(replenish_by_date);
CREATE INDEX idx_orders_customer         ON orders(customer_id);
CREATE INDEX idx_orders_status           ON orders(status);
CREATE INDEX idx_order_items_order       ON order_items(order_id);
CREATE INDEX idx_order_items_customer    ON order_items(customer_id);
CREATE INDEX idx_order_items_confirmed   ON order_items(confirmed_at);
CREATE INDEX idx_instructions_customer  ON shipment_instructions(customer_id);
CREATE INDEX idx_instructions_ack       ON shipment_instructions(is_acknowledged);
CREATE INDEX idx_pdfs_customer_current  ON customer_pdfs(customer_id, is_current);


-- ============================================================
-- UPDATED_AT TRIGGER — auto-updates updated_at on any change
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_customers_updated
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_household_updated
  BEFORE UPDATE ON household
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_prefs_updated
  BEFORE UPDATE ON customer_preferences
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_inventory_updated
  BEFORE UPDATE ON inventory_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_orders_updated
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_order_items_updated
  BEFORE UPDATE ON order_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ============================================================
-- ORDER NUMBER GENERATOR
-- Auto-generates QR-YYYY-NNNNNN on insert
-- ============================================================
CREATE SEQUENCE order_number_seq START 1000;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := 'QR-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
                        LPAD(nextval('order_number_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();


-- ============================================================
-- SHIPMENT CONFIRMED TRIGGER
-- When confirmed_at is set on an order_item, auto-creates
-- a shipment_instruction record for the customer portal.
-- ============================================================
CREATE OR REPLACE FUNCTION create_shipment_instruction()
RETURNS TRIGGER AS $$
DECLARE
  v_container_code TEXT;
  v_container_id   UUID;
BEGIN
  -- Only fire when confirmed_at transitions from NULL to a value
  IF OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL THEN

    -- Find best available container for this customer
    -- (Admin can override later via portal)
    SELECT id, container_code
      INTO v_container_id, v_container_code
      FROM storage_containers
     WHERE customer_id = NEW.customer_id
       AND is_pet_container = FALSE
     ORDER BY container_code
     LIMIT 1;

    INSERT INTO shipment_instructions (
      customer_id, order_item_id, container_id,
      container_code, product_name,
      instruction_text, label_text
    ) VALUES (
      NEW.customer_id,
      NEW.id,
      v_container_id,
      COALESCE(v_container_code, 'TBD'),
      NEW.product_name,
      'Place ' || NEW.qty::TEXT || ' ' || NEW.unit ||
        ' of ' || NEW.product_name ||
        ' into container ' || COALESCE(v_container_code, 'TBD') || '.',
      NEW.product_name || ' | ' || NEW.qty::TEXT || ' ' || NEW.unit ||
        ' | Container ' || COALESCE(v_container_code, 'TBD')
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_shipment_confirmed
  AFTER UPDATE ON order_items
  FOR EACH ROW EXECUTE FUNCTION create_shipment_instruction();


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Customers can only see their own data.
-- Admins bypass RLS via service_role key (used server-side only).
-- ============================================================
ALTER TABLE customers              ENABLE ROW LEVEL SECURITY;
ALTER TABLE household              ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_preferences   ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_containers     ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items            ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_instructions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_pdfs          ENABLE ROW LEVEL SECURITY;

-- Customers see only their own rows
CREATE POLICY "customer_own_data" ON customers
  FOR ALL USING (auth.uid() = auth_user_id);

CREATE POLICY "customer_own_household" ON household
  FOR ALL USING (customer_id = (
    SELECT id FROM customers WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "customer_own_pets" ON pets
  FOR ALL USING (customer_id = (
    SELECT id FROM customers WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "customer_own_prefs" ON customer_preferences
  FOR ALL USING (customer_id = (
    SELECT id FROM customers WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "customer_own_containers" ON storage_containers
  FOR ALL USING (customer_id = (
    SELECT id FROM customers WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "customer_own_inventory" ON inventory_items
  FOR ALL USING (customer_id = (
    SELECT id FROM customers WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "customer_own_orders" ON orders
  FOR SELECT USING (customer_id = (
    SELECT id FROM customers WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "customer_own_order_items" ON order_items
  FOR SELECT USING (customer_id = (
    SELECT id FROM customers WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "customer_own_instructions" ON shipment_instructions
  FOR ALL USING (customer_id = (
    SELECT id FROM customers WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "customer_own_pdfs" ON customer_pdfs
  FOR SELECT USING (customer_id = (
    SELECT id FROM customers WHERE auth_user_id = auth.uid()
  ));

-- Admin users bypass RLS (handled via service_role key in Node API)
-- No RLS policies needed on admin_users table itself —
-- it is only ever accessed server-side via service_role.
