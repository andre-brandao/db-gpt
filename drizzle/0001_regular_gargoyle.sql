CREATE TYPE "public"."resource_status" AS ENUM('draft', 'published', 'archived', 'deleted', 'pending_review', 'pending_embedding');--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "source" text;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "status" "resource_status";