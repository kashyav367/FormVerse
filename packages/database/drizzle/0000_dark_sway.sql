CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(80) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false,
	"profile_image_url" text,
	"salt" text,
	"password" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"created_by" uuid NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"visibility" text DEFAULT 'UNLISTED' NOT NULL,
	"theme" text DEFAULT 'Aurora' NOT NULL,
	"template" text DEFAULT 'BLANK' NOT NULL,
	"category" text DEFAULT 'Feedback' NOT NULL,
	"icon" text DEFAULT '📝' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"label" text NOT NULL,
	"label_key" text NOT NULL,
	"type" text NOT NULL,
	"options" text,
	"index" integer NOT NULL,
	"placeholder" text,
	"description" text,
	"is_required" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"response_data" text NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL
);
