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

export const petProfile = pgTable('pet', {
  id: serial().primaryKey(),
  petType: text('pet_type'),
  age: integer('age'),
  dob: date('dob'),
  weight: integer('weight'),
  name: text('name')
})

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type SelectPetProfile = typeof petProfile.$inferSelect;
export type InsertPetProfile = typeof petProfile.$inferInsert;
