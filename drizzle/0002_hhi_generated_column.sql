-- Migration 0002: Add HHI as a GENERATED ALWAYS STORED column
-- This makes HHI a first-class column that can be SELECTed, indexed, and
-- sorted on directly — no more CTE or SQL injection of the formula.
--
-- Pre-flight: Verify no hotel has weighted-sum HHI below 40:
--   SELECT id, slug, ROUND((
--     score_historical_significance * 0.15 + score_architectural_integrity * 0.15
--     + score_cultural_immersion * 0.10 + score_authentic_experience * 0.15
--     + score_reputation * 0.12 + score_service_quality * 0.08
--     + score_conservation * 0.10 + score_modern_comforts * 0.08
--     + score_value * 0.07
--   )::numeric, 2) AS hhi FROM hotels WHERE ROUND((
--     score_historical_significance * 0.15 + score_architectural_integrity * 0.15
--     + score_cultural_immersion * 0.10 + score_authentic_experience * 0.15
--     + score_reputation * 0.12 + score_service_quality * 0.08
--     + score_conservation * 0.10 + score_modern_comforts * 0.08
--     + score_value * 0.07
--   )::numeric, 2) < 40;

ALTER TABLE hotels ADD COLUMN hhi numeric(5,2) GENERATED ALWAYS AS (
  ROUND((
    score_historical_significance * 0.15
    + score_architectural_integrity * 0.15
    + score_cultural_immersion * 0.10
    + score_authentic_experience * 0.15
    + score_reputation * 0.12
    + score_service_quality * 0.08
    + score_conservation * 0.10
    + score_modern_comforts * 0.08
    + score_value * 0.07
  )::numeric, 2)
) STORED;
--> statement-breakpoint
ALTER TABLE hotels ADD CONSTRAINT hhi_minimum CHECK (hhi >= 40);
