import { relations } from 'drizzle-orm';
import { pgTable, serial, integer, text, timestamp, date, time, boolean } from 'drizzle-orm/pg-core';

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
  // ...timestamps,
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
  // TODO: get rid of timestamps for session or update the db queries?
  // ...timestamps,
});

export const petProfiles = pgTable('pet', {
  id: serial().primaryKey(),
  petType: text('pet_type'),
  age: integer('age'),
  dob: date('dob'),
  weight: integer('weight'),
  name: text('name'),
  userId: text('user_id'),
  ...timestamps,
});

export const supplies = pgTable('supplies', {
  id: serial().primaryKey(),
  supplyType: text('supply_type'),
  inventory: integer('inventory'),
  description: text('description'),
  petId: integer('pet_id'),
  ...timestamps,
});

export const todos = pgTable('todos', {
  id: serial().primaryKey(),
  title: text('title'),
  dueDate: date('due_date'),
  dueTime: time('due_time'),
  complete: boolean('complete'),
  notes: text('notes'),
  recurring: boolean('recurring'),
  label: text('label'),
  petId: integer('pet_id'),
  ...timestamps,
});

export const userRelations = relations(user, ({ many }) => ({
  petProfiles: many(petProfiles),
}));

export const petProfileRelations = relations(petProfiles, ({ one, many }) => ({
  user: one(user, {
    fields: [petProfiles.userId],
    references: [user.id],
  }),
  supplies: many(supplies),
  todos: many(todos),
}));

export const suppliesRelations = relations(supplies, ({ one }) => ({
  pet: one(petProfiles, {
    fields: [supplies.petId],
    references: [petProfiles.id],
  }),
}));

export const todosRelations = relations(todos, ({ one }) => ({
  pet: one(petProfiles, {
    fields: [todos.petId],
    references: [petProfiles.id],
  }),
}));

export type Session = typeof session.$inferSelect;

export type UserSelect = typeof user.$inferSelect;
export type UserInsert = typeof user.$inferInsert;

export type SelectPetProfiles = typeof petProfiles.$inferSelect;
export type InsertPetProfiles = typeof petProfiles.$inferInsert;

export type SelectSupplies = typeof supplies.$inferSelect;
export type InsertSupplies = typeof supplies.$inferInsert;

export type SelectTodos = typeof todos.$inferSelect;
export type InsertTodos = typeof todos.$inferInsert;
