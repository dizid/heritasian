-- Migration 0003: Add pillar scores as GENERATED ALWAYS STORED columns
-- Eliminates the need for inline SQL pillar formulas in resolveSortColumn()
-- and derivePillarScores(). Sorting by pillar becomes ORDER BY pillar_ha DESC.

ALTER TABLE hotels ADD COLUMN pillar_ha numeric(5,2) GENERATED ALWAYS AS (
  ROUND(((score_historical_significance * 15 + score_architectural_integrity * 15 + score_cultural_immersion * 10) / 40.0)::numeric, 1)
) STORED;
--> statement-breakpoint
ALTER TABLE hotels ADD COLUMN pillar_ge numeric(5,2) GENERATED ALWAYS AS (
  ROUND(((score_authentic_experience * 15 + score_reputation * 12 + score_service_quality * 8) / 35.0)::numeric, 1)
) STORED;
--> statement-breakpoint
ALTER TABLE hotels ADD COLUMN pillar_oe numeric(5,2) GENERATED ALWAYS AS (
  ROUND(((score_conservation * 10 + score_modern_comforts * 8 + score_value * 7) / 25.0)::numeric, 1)
) STORED;
