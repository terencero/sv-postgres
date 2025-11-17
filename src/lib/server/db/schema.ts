import { relations } from 'drizzle-orm';
import { pgTable, serial, integer, text, timestamp, date } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const petProfiles = pgTable('pet', {
  id: serial().primaryKey(),
  petType: text('pet_type'),
  age: integer('age'),
  dob: date('dob'),
  weight: integer('weight'),
  name: text('name')
});

export const supplies = pgTable('supplies', {
  id: serial().primaryKey(),
  supplyType: text('supply_type'),
  inventory: integer('inventory'),
  description: text('description'),
  petId: text('pet_id')
});

export const petProfileRelations = relations(petProfiles, ({ many }) => ({
  supplies: many(supplies),
}));

export const suppliesRelations = relations(supplies, ({ one }) => ({
  pet: one(petProfiles, {
    fields: [supplies.petId],
    references: [petProfiles.id]
  })
}))
export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type SelectPetProfiles = typeof petProfiles.$inferSelect;
export type InsertPetProfiles = typeof petProfiles.$inferInsert;

export type SelectSupplies = typeof supplies.$inferSelect;
export type InsertSupplies = typeof supplies.$inferInsert;

