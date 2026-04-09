-- Migration 0006: Add updated_at timestamp to hotels
-- created_at already exists from initial schema. This adds updated_at
-- for Phase 1B "Why This Score" UI to show "last reviewed" dates.

ALTER TABLE hotels ADD COLUMN updated_at timestamp with time zone NOT NULL DEFAULT now();
