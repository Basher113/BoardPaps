-- Convert integer positions to Lexorank strings
-- This migration converts existing integer positions to base-36 lexorank strings
-- Run this after deploying the updated code that uses lexorank

-- Step 1: Add temporary column
ALTER TABLE "Issue" ADD COLUMN IF NOT EXISTS "position_temp" TEXT;

-- Step 2: Convert integer positions to base-36 padded strings
-- For each column, rank issues by their position and assign lexorank strings
-- Using a simple approach: just convert the integer to base-36 and pad it

DO $$
DECLARE
  issue_record RECORD;
  column_record RECORD;
  rank_counter INTEGER;
BEGIN
  -- For each column, assign lexorank strings in order
  FOR column_record IN SELECT DISTINCT "columnId" FROM "Issue" LOOP
    rank_counter := 0;
    FOR issue_record IN 
      SELECT id FROM "Issue" 
      WHERE "columnId" = column_record."columnId" 
      ORDER BY "position" ASC 
    LOOP
      UPDATE "Issue"
      SET "position_temp" = lpad(to_char(rank_counter, 'FM9999999999'), '0', '0')
      WHERE id = issue_record.id;
      rank_counter := rank_counter + 1;
    END LOOP;
  END LOOP;
END $$;

-- Step 3: Drop the old position column
ALTER TABLE "Issue" DROP COLUMN "position";

-- Step 4: Rename the temporary column
ALTER TABLE "Issue" RENAME COLUMN "position_temp" TO "position";
