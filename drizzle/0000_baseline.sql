-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "countries" (
	"code" varchar(2) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"flag" varchar(10)
);
--> statement-breakpoint
CREATE TABLE "timeline_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" uuid,
	"year" integer NOT NULL,
	"event" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hotels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(200) NOT NULL,
	"name" varchar(200) NOT NULL,
	"country_code" varchar(2),
	"city" varchar(100) NOT NULL,
	"year_built" integer,
	"original_purpose" varchar(200),
	"architectural_style" varchar(100),
	"description" text,
	"highlights" text[],
	"image_url" varchar(500),
	"website_url" varchar(500),
	"price_range" varchar(4),
	"score_historical_significance" integer,
	"score_architectural_integrity" integer,
	"score_cultural_immersion" integer,
	"score_authentic_experience" integer,
	"score_reputation" integer,
	"score_service_quality" integer,
	"score_conservation" integer,
	"score_modern_comforts" integer,
	"score_value" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"tagline" varchar(200),
	CONSTRAINT "hotels_slug_key" UNIQUE("slug"),
	CONSTRAINT "hotels_price_range_check" CHECK ((price_range)::text = ANY ((ARRAY['$'::character varying, '$$'::character varying, '$$$'::character varying, '$$$$'::character varying])::text[])),
	CONSTRAINT "hotels_score_historical_significance_check" CHECK ((score_historical_significance >= 0) AND (score_historical_significance <= 100)),
	CONSTRAINT "hotels_score_architectural_integrity_check" CHECK ((score_architectural_integrity >= 0) AND (score_architectural_integrity <= 100)),
	CONSTRAINT "hotels_score_cultural_immersion_check" CHECK ((score_cultural_immersion >= 0) AND (score_cultural_immersion <= 100)),
	CONSTRAINT "hotels_score_authentic_experience_check" CHECK ((score_authentic_experience >= 0) AND (score_authentic_experience <= 100)),
	CONSTRAINT "hotels_score_reputation_check" CHECK ((score_reputation >= 0) AND (score_reputation <= 100)),
	CONSTRAINT "hotels_score_service_quality_check" CHECK ((score_service_quality >= 0) AND (score_service_quality <= 100)),
	CONSTRAINT "hotels_score_conservation_check" CHECK ((score_conservation >= 0) AND (score_conservation <= 100)),
	CONSTRAINT "hotels_score_modern_comforts_check" CHECK ((score_modern_comforts >= 0) AND (score_modern_comforts <= 100)),
	CONSTRAINT "hotels_score_value_check" CHECK ((score_value >= 0) AND (score_value <= 100))
);
--> statement-breakpoint
ALTER TABLE "timeline_events" ADD CONSTRAINT "timeline_events_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_country_code_fkey" FOREIGN KEY ("country_code") REFERENCES "public"."countries"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_timeline_hotel" ON "timeline_events" USING btree ("hotel_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_hotels_country" ON "hotels" USING btree ("country_code" text_ops);--> statement-breakpoint
CREATE INDEX "idx_hotels_slug" ON "hotels" USING btree ("slug" text_ops);
*/