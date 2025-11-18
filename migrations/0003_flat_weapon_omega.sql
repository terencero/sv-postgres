CREATE TABLE "todos" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"due_date" date,
	"due_time" time,
	"complete" boolean,
	"notes" text,
	"recurring" boolean,
	"label" text,
	"pet_id" integer,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
