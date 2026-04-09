import { relations } from "drizzle-orm/relations";
import { hotels, timelineEvents, countries } from "./schema";

export const timelineEventsRelations = relations(timelineEvents, ({one}) => ({
	hotel: one(hotels, {
		fields: [timelineEvents.hotelId],
		references: [hotels.id]
	}),
}));

export const hotelsRelations = relations(hotels, ({one, many}) => ({
	timelineEvents: many(timelineEvents),
	country: one(countries, {
		fields: [hotels.countryCode],
		references: [countries.code]
	}),
}));

export const countriesRelations = relations(countries, ({many}) => ({
	hotels: many(hotels),
}));