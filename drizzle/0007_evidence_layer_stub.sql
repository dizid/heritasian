-- Migration 0007: Create score_evidence table (empty scaffold for Phase 1B)
-- Phase 1A creates the table structure only — no data is inserted.
-- Phase 1B will populate this and build the "Why This Score" UI.

CREATE TABLE score_evidence (
  id serial PRIMARY KEY,
  hotel_id uuid NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  dimension text NOT NULL CHECK (dimension IN (
    'historical_significance', 'architectural_integrity', 'cultural_immersion',
    'authentic_experience', 'reputation', 'service_quality',
    'conservation', 'modern_comforts', 'value'
  )),
  source_url text,
  excerpt text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX idx_score_evidence_hotel_dim ON score_evidence (hotel_id, dimension);
