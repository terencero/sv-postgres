ALTER TABLE "pet" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "pet" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "pet" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "supplies" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "supplies" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "supplies" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "deleted_at" timestamp;