CREATE TABLE "analytics_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(100) NOT NULL,
	"event_name" varchar(255) NOT NULL,
	"properties" jsonb,
	"timestamp" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"user_id" varchar(100),
	"page_url" text,
	"referrer" text,
	"user_agent" text,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "analytics_funnels" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"steps" jsonb NOT NULL,
	"config" jsonb,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "analytics_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(100) NOT NULL,
	"user_id" varchar(100),
	"start_time" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"end_time" timestamp (3) with time zone,
	"duration" integer,
	"page_views" integer DEFAULT 0,
	"properties" jsonb,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "analytics_sessions_session_id_unique" UNIQUE("session_id")
);
