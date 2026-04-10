import { relations } from "drizzle-orm/relations";
import { hotels, timelineEvents, countries, scoreEvidence } from "./schema";

export const timelineEventsRelations = relations(timelineEvents, ({one}) => ({
	hotel: one(hotels, {
		fields: [timelineEvents.hotelId],
		references: [hotels.id]
	}),
}));

export const hotelsRelations = relations(hotels, ({one, many}) => ({
	timelineEvents: many(timelineEvents),
	scoreEvidence: many(scoreEvidence),
	country: one(countries, {
		fields: [hotels.countryCode],
		references: [countries.code]
	}),
}));

export const countriesRelations = relations(countries, ({many}) => ({
	hotels: many(hotels),
}));

export const scoreEvidenceRelations = relations(scoreEvidence, ({one}) => ({
	hotel: one(hotels, {
		fields: [scoreEvidence.hotelId],
		references: [hotels.id]
	}),
}));
