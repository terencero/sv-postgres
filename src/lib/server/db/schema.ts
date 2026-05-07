import { relations } from 'drizzle-orm';
import {
	pgTable,
	serial,
	integer,
	text,
	timestamp,
	date,
	time,
	boolean,
} from 'drizzle-orm/pg-core';

const timestamps = {
	updated_at: timestamp(),
	created_at: timestamp().defaultNow().notNull(),
	deleted_at: timestamp(),
};

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
	id: serial().primaryKey().notNull(),
	petType: text('pet_type'),
	age: integer('age'),
	dob: date('dob'),
	weight: integer('weight'),
	name: text('name'),
	userId: text('user_id'),
	...timestamps,
});

export const supplies = pgTable('supplies', {
	id: serial().primaryKey().notNull(),
	supplyType: text('supply_type'),
	inventory: integer('inventory'),
	description: text('description'),
	petId: integer('pet_id'),
	...timestamps,
});

export const todos = pgTable('todos', {
	id: serial().primaryKey().notNull(),
	title: text('title'),
	dueDate: date('due_date'),
	dueTime: time('due_time'),
	complete: boolean('complete'),
	notes: text('notes'),
	repeats: text('repeats'),
	label: text('label'),
	petId: integer('pet_id'),
	...timestamps,
});

export const petSitters = pgTable('sitters', {
	id: serial().primaryKey().notNull(),
	sitterName: text('sitter_name'),
	sitterStartDate: date('sitter_start_date'),
	sitterEndDate: date('sitter_end_date'),
	sitterTel: text('sitter_tel'),
	sittingLocation: text('sitting_location'),
	sitterEmail: text('sitter_email'),
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
	petSitters: many(petSitters),
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

export const sittersRelations = relations(petSitters, ({ one }) => ({
	pet: one(petProfiles, {
		fields: [petSitters.petId],
		references: [petProfiles.id],
	}),
}));

export type Session = typeof session.$inferSelect;

export type UserSelect = typeof user.$inferSelect;
export type UserInsert = typeof user.$inferInsert;

export type SelectPetProfiles = typeof petProfiles.$inferSelect;
export type InsertPetProfiles = typeof petProfiles.$inferInsert;

export type SelectSupplies = typeof supplies.$inferSelect;
export type Supplies = Omit<SelectSupplies, 'created_at' | 'deleted_at' | 'updated_at'>;
export type InsertSupplies = typeof supplies.$inferInsert;

export type SelectTodos = typeof todos.$inferSelect;
export type Todos = Omit<SelectTodos, 'created_at' | 'deleted_at' | 'updated_at'>;
export type InsertTodos = typeof todos.$inferInsert;

export type SelectPetSitters = typeof petSitters.$inferSelect;
export type PetSitters = Omit<SelectPetSitters, 'created_at' | 'deleted_at' | 'updated_at'>;
export type InsertPetSitters = typeof petSitters.$inferInsert;
