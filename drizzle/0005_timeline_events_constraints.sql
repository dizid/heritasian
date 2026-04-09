-- Migration 0005: Add NOT NULL to timeline_events.hotel_id
-- year and event are already NOT NULL. FK with CASCADE already exists.
--
-- Pre-flight: Verify no orphan rows:
--   SELECT id FROM timeline_events WHERE hotel_id IS NULL;

ALTER TABLE timeline_events ALTER COLUMN hotel_id SET NOT NULL;
