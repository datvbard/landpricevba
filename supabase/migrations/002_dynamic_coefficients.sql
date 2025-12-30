-- Migration: Dynamic Coefficient System
-- This migration creates a flexible coefficient system that allows adding/removing coefficient types dynamically

-- ============================================================================
-- 1. Create coefficient_types table (defines available coefficient types)
-- ============================================================================
CREATE TABLE IF NOT EXISTS coefficient_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,           -- e.g., 'land_type', 'location', 'custom_factor'
  name VARCHAR(100) NOT NULL,                  -- Display name: 'Loại đất', 'Vị trí'
  description TEXT,                            -- Optional description
  -- Field configuration (which extra fields this type has)
  has_range BOOLEAN DEFAULT FALSE,             -- Whether this type has min/max range fields
  range_field_name VARCHAR(50),                -- e.g., 'area', 'depth', 'width' (for min/max fields)
  range_unit VARCHAR(20),                      -- e.g., 'm²', 'm', 'cm'
  has_description BOOLEAN DEFAULT TRUE,        -- Whether values can have description
  -- UI/UX settings
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. Create coefficient_values table (stores all coefficient values)
-- ============================================================================
CREATE TABLE IF NOT EXISTS coefficient_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type_id UUID NOT NULL REFERENCES coefficient_types(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL,                   -- e.g., 'MT', 'HEM', 'DT1'
  name VARCHAR(100) NOT NULL,                  -- Display name
  description TEXT,                            -- Optional description
  coefficient DECIMAL(10, 4) DEFAULT 1.0,      -- The coefficient value
  -- Range fields (used when type has_range = true)
  range_min DECIMAL(10, 2),                    -- Min value (area_min, depth_min, width_min)
  range_max DECIMAL(10, 2),                    -- Max value (area_max, depth_max, width_max)
  -- Ordering
  sort_order INT DEFAULT 0,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Unique constraint: code must be unique within a type
  UNIQUE(type_id, code)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_coefficient_values_type_id ON coefficient_values(type_id);
CREATE INDEX IF NOT EXISTS idx_coefficient_values_code ON coefficient_values(code);
CREATE INDEX IF NOT EXISTS idx_coefficient_types_code ON coefficient_types(code);

-- ============================================================================
-- 3. Insert default coefficient types (matching existing 5 types)
-- ============================================================================
INSERT INTO coefficient_types (code, name, description, has_range, range_field_name, range_unit, has_description, sort_order) VALUES
  ('land_type', 'Loại đất', 'Hệ số theo loại đất (mặt tiền, hẻm, đất nông nghiệp...)', FALSE, NULL, NULL, TRUE, 1),
  ('location', 'Vị trí', 'Hệ số theo vị trí (độ rộng mặt tiền)', TRUE, 'width', 'm', TRUE, 2),
  ('area', 'Diện tích', 'Hệ số theo diện tích đất', TRUE, 'area', 'm²', FALSE, 3),
  ('depth', 'Chiều sâu', 'Hệ số theo chiều sâu thửa đất', TRUE, 'depth', 'm', FALSE, 4),
  ('feng_shui', 'Phong thủy', 'Hệ số theo yếu tố phong thủy', FALSE, NULL, NULL, TRUE, 5)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- 4. Migrate existing data from old tables to new structure
-- ============================================================================

-- Migrate land_type_coefficients
INSERT INTO coefficient_values (type_id, code, name, description, coefficient, sort_order, created_at)
SELECT
  (SELECT id FROM coefficient_types WHERE code = 'land_type'),
  ltc.code,
  ltc.name,
  ltc.description,
  ltc.coefficient,
  ltc.sort_order,
  ltc.created_at
FROM land_type_coefficients ltc
ON CONFLICT (type_id, code) DO NOTHING;

-- Migrate location_coefficients
INSERT INTO coefficient_values (type_id, code, name, description, coefficient, range_min, range_max, sort_order, created_at)
SELECT
  (SELECT id FROM coefficient_types WHERE code = 'location'),
  lc.code,
  lc.name,
  lc.description,
  lc.coefficient,
  lc.width_min,
  lc.width_max,
  lc.sort_order,
  lc.created_at
FROM location_coefficients lc
ON CONFLICT (type_id, code) DO NOTHING;

-- Migrate area_coefficients
INSERT INTO coefficient_values (type_id, code, name, description, coefficient, range_min, range_max, sort_order, created_at)
SELECT
  (SELECT id FROM coefficient_types WHERE code = 'area'),
  ac.code,
  ac.name,
  NULL,  -- area_coefficients doesn't have description
  ac.coefficient,
  ac.area_min,
  ac.area_max,
  ac.sort_order,
  ac.created_at
FROM area_coefficients ac
ON CONFLICT (type_id, code) DO NOTHING;

-- Migrate depth_coefficients
INSERT INTO coefficient_values (type_id, code, name, description, coefficient, range_min, range_max, sort_order, created_at)
SELECT
  (SELECT id FROM coefficient_types WHERE code = 'depth'),
  dc.code,
  dc.name,
  NULL,  -- depth_coefficients doesn't have description
  dc.coefficient,
  dc.depth_min,
  dc.depth_max,
  dc.sort_order,
  dc.created_at
FROM depth_coefficients dc
ON CONFLICT (type_id, code) DO NOTHING;

-- Migrate feng_shui_coefficients
INSERT INTO coefficient_values (type_id, code, name, description, coefficient, sort_order, created_at)
SELECT
  (SELECT id FROM coefficient_types WHERE code = 'feng_shui'),
  fsc.code,
  fsc.name,
  fsc.description,
  fsc.coefficient,
  fsc.sort_order,
  fsc.created_at
FROM feng_shui_coefficients fsc
ON CONFLICT (type_id, code) DO NOTHING;

-- ============================================================================
-- 5. Create updated_at trigger
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_coefficient_types_updated_at
  BEFORE UPDATE ON coefficient_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coefficient_values_updated_at
  BEFORE UPDATE ON coefficient_values
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Note: Old tables are kept for backward compatibility.
-- They can be dropped after confirming the migration is successful:
-- DROP TABLE IF EXISTS land_type_coefficients;
-- DROP TABLE IF EXISTS location_coefficients;
-- DROP TABLE IF EXISTS area_coefficients;
-- DROP TABLE IF EXISTS depth_coefficients;
-- DROP TABLE IF EXISTS feng_shui_coefficients;
-- ============================================================================
