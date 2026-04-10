-- Migration 0008: Add rating_rationale column to score_evidence
-- Stores the editor's reasoning tying all evidence together into the
-- specific 0-100 score for a given dimension on a given hotel.
-- Distinct from excerpt (quotes a source) and notes (annotates a source).

ALTER TABLE score_evidence ADD COLUMN rating_rationale text;
