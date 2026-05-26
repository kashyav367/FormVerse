ALTER TABLE "forms" ADD COLUMN "theme" text DEFAULT 'Aurora' NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "template" text DEFAULT 'BLANK' NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "category" text DEFAULT 'Feedback' NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "icon" text DEFAULT '📝' NOT NULL;