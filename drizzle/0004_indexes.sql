-- Migration 0004: Add indexes for sort and filter performance
-- idx_hotels_country and idx_hotels_slug already exist from initial schema.
-- idx_timeline_hotel already exists from initial schema.

CREATE INDEX idx_hotels_hhi_desc ON hotels (hhi DESC);
--> statement-breakpoint
CREATE INDEX idx_hotels_pillar_ha ON hotels (pillar_ha DESC);
--> statement-breakpoint
CREATE INDEX idx_hotels_pillar_ge ON hotels (pillar_ge DESC);
--> statement-breakpoint
CREATE INDEX idx_hotels_pillar_oe ON hotels (pillar_oe DESC);
--> statement-breakpoint
CREATE INDEX idx_hotels_year_built ON hotels (year_built);
