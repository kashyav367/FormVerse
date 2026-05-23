ALTER TABLE "forms" ADD COLUMN "is_published" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "visibility" text DEFAULT 'UNLISTED' NOT NULL;