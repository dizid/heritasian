-- Migration 0001: Add NOT NULL constraints to core columns
-- CHECK constraints on score columns (0-100) already exist from initial schema.
-- UNIQUE on slug already exists. This migration adds NOT NULL where missing.
--
-- Pre-flight: Run before applying to verify no NULLs exist in these columns:
--   SELECT id, slug FROM hotels WHERE
--     country_code IS NULL OR year_built IS NULL OR description IS NULL
--     OR price_range IS NULL
--     OR score_historical_significance IS NULL OR score_architectural_integrity IS NULL
--     OR score_cultural_immersion IS NULL OR score_authentic_experience IS NULL
--     OR score_reputation IS NULL OR score_service_quality IS NULL
--     OR score_conservation IS NULL OR score_modern_comforts IS NULL
--     OR score_value IS NULL;

ALTER TABLE hotels ALTER COLUMN country_code SET NOT NULL;
--> statement-breakpoint
ALTER TABLE hotels ALTER COLUMN year_built SET NOT NULL;
--> statement-breakpoint
ALTER TABLE hotels ALTER COLUMN description SET NOT NULL;
--> statement-breakpoint
ALTER TABLE hotels ALTER COLUMN price_range SET NOT NULL;
--> statement-breakpoint
ALTER TABLE hotels ALTER COLUMN score_historical_significance SET NOT NULL;
--> statement-breakpoint
ALTER TABLE hotels ALTER COLUMN score_architectural_integrity SET NOT NULL;
--> statement-breakpoint
ALTER TABLE hotels ALTER COLUMN score_cultural_immersion SET NOT NULL;
--> statement-breakpoint
ALTER TABLE hotels ALTER COLUMN score_authentic_experience SET NOT NULL;
--> statement-breakpoint
ALTER TABLE hotels ALTER COLUMN score_reputation SET NOT NULL;
--> statement-breakpoint
ALTER TABLE hotels ALTER COLUMN score_service_quality SET NOT NULL;
--> statement-breakpoint
ALTER TABLE hotels ALTER COLUMN score_conservation SET NOT NULL;
--> statement-breakpoint
ALTER TABLE hotels ALTER COLUMN score_modern_comforts SET NOT NULL;
--> statement-breakpoint
ALTER TABLE hotels ALTER COLUMN score_value SET NOT NULL;
