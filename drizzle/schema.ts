import { pgTable, varchar, index, foreignKey, uuid, integer, text, unique, check, timestamp, numeric, serial } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const countries = pgTable("countries", {
	code: varchar({ length: 2 }).primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	flag: varchar({ length: 10 }),
});

export const timelineEvents = pgTable("timeline_events", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	hotelId: uuid("hotel_id").notNull(),
	year: integer().notNull(),
	event: text().notNull(),
}, (table) => [
	index("idx_timeline_hotel").using("btree", table.hotelId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.hotelId],
			foreignColumns: [hotels.id],
			name: "timeline_events_hotel_id_fkey"
		}).onDelete("cascade"),
]);

export const hotels = pgTable("hotels", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	slug: varchar({ length: 200 }).notNull(),
	name: varchar({ length: 200 }).notNull(),
	countryCode: varchar("country_code", { length: 2 }).notNull(),
	city: varchar({ length: 100 }).notNull(),
	yearBuilt: integer("year_built").notNull(),
	originalPurpose: varchar("original_purpose", { length: 200 }),
	architecturalStyle: varchar("architectural_style", { length: 100 }),
	description: text().notNull(),
	highlights: text().array(),
	imageUrl: varchar("image_url", { length: 500 }),
	websiteUrl: varchar("website_url", { length: 500 }),
	priceRange: varchar("price_range", { length: 4 }).notNull(),
	scoreHistoricalSignificance: integer("score_historical_significance").notNull(),
	scoreArchitecturalIntegrity: integer("score_architectural_integrity").notNull(),
	scoreCulturalImmersion: integer("score_cultural_immersion").notNull(),
	scoreAuthenticExperience: integer("score_authentic_experience").notNull(),
	scoreReputation: integer("score_reputation").notNull(),
	scoreServiceQuality: integer("score_service_quality").notNull(),
	scoreConservation: integer("score_conservation").notNull(),
	scoreModernComforts: integer("score_modern_comforts").notNull(),
	scoreValue: integer("score_value").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	tagline: varchar({ length: 200 }),
	hhi: numeric({ precision: 5, scale: 2 }).generatedAlwaysAs(sql`round(((((((((score_historical_significance)::numeric * 0.15) + ((score_architectural_integrity)::numeric * 0.15)) + ((score_cultural_immersion)::numeric * 0.10)) + ((score_authentic_experience)::numeric * 0.15)) + ((score_reputation)::numeric * 0.12)) + ((score_service_quality)::numeric * 0.08)) + ((score_conservation)::numeric * 0.10)) + ((score_modern_comforts)::numeric * 0.08)) + ((score_value)::numeric * 0.07)), 2)`),
	pillarHa: numeric("pillar_ha", { precision: 5, scale: 2 }).generatedAlwaysAs(sql`round((((((score_historical_significance * 15) + (score_architectural_integrity * 15)) + (score_cultural_immersion * 10)))::numeric / 40.0), 1)`),
	pillarGe: numeric("pillar_ge", { precision: 5, scale: 2 }).generatedAlwaysAs(sql`round((((((score_authentic_experience * 15) + (score_reputation * 12)) + (score_service_quality * 8)))::numeric / 35.0), 1)`),
	pillarOe: numeric("pillar_oe", { precision: 5, scale: 2 }).generatedAlwaysAs(sql`round((((((score_conservation * 10) + (score_modern_comforts * 8)) + (score_value * 7)))::numeric / 25.0), 1)`),
}, (table) => [
	index("idx_hotels_country").using("btree", table.countryCode.asc().nullsLast().op("text_ops")),
	index("idx_hotels_slug").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.countryCode],
			foreignColumns: [countries.code],
			name: "hotels_country_code_fkey"
		}),
	unique("hotels_slug_key").on(table.slug),
	check("hotels_price_range_check", sql`(price_range)::text = ANY ((ARRAY['$'::character varying, '$$'::character varying, '$$$'::character varying, '$$$$'::character varying])::text[])`),
	check("hotels_score_historical_significance_check", sql`(score_historical_significance >= 0) AND (score_historical_significance <= 100)`),
	check("hotels_score_architectural_integrity_check", sql`(score_architectural_integrity >= 0) AND (score_architectural_integrity <= 100)`),
	check("hotels_score_cultural_immersion_check", sql`(score_cultural_immersion >= 0) AND (score_cultural_immersion <= 100)`),
	check("hotels_score_authentic_experience_check", sql`(score_authentic_experience >= 0) AND (score_authentic_experience <= 100)`),
	check("hotels_score_reputation_check", sql`(score_reputation >= 0) AND (score_reputation <= 100)`),
	check("hotels_score_service_quality_check", sql`(score_service_quality >= 0) AND (score_service_quality <= 100)`),
	check("hotels_score_conservation_check", sql`(score_conservation >= 0) AND (score_conservation <= 100)`),
	check("hotels_score_modern_comforts_check", sql`(score_modern_comforts >= 0) AND (score_modern_comforts <= 100)`),
	check("hotels_score_value_check", sql`(score_value >= 0) AND (score_value <= 100)`),
]);

export const scoreEvidence = pgTable("score_evidence", {
	id: serial().primaryKey(),
	hotelId: uuid("hotel_id").notNull().references(() => hotels.id, { onDelete: "cascade" }),
	dimension: text().notNull(),
	sourceUrl: text("source_url"),
	excerpt: text(),
	notes: text(),
	ratingRationale: text("rating_rationale"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_score_evidence_hotel_dim").on(table.hotelId, table.dimension),
	check("score_evidence_dimension_check", sql`dimension IN (
		'historical_significance', 'architectural_integrity', 'cultural_immersion',
		'authentic_experience', 'reputation', 'service_quality',
		'conservation', 'modern_comforts', 'value'
	)`),
]);
