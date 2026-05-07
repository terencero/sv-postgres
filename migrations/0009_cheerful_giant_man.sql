CREATE TABLE "sitters" (
	"id" serial PRIMARY KEY NOT NULL,
	"sitter_name" text,
	"sitter_start_date" date,
	"sitter_end_date" date,
	"sitter_tel" text,
	"sitting_location" text,
	"sitter_email" text
);
