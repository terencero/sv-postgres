ALTER TABLE "sitters" ADD COLUMN "pet_id" integer;--> statement-breakpoint
ALTER TABLE "sitters" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "sitters" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sitters" ADD COLUMN "deleted_at" timestamp;