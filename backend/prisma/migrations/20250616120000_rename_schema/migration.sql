-- Rename legacy schema after rebrand from CircuitCrafter to SiliconBazaar
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'circuitcrafter')
     AND NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'siliconbazaar') THEN
    ALTER SCHEMA circuitcrafter RENAME TO siliconbazaar;
  END IF;
END $$;
