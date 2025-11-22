ALTER TABLE "pet" ADD COLUMN "user_id" integer;--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "deleted_at";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "deleted_at";