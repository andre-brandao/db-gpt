import {
  pgTable,
  pgEnum,
  serial,
  integer,
  text,
  json,
  timestamp,
  time,
  decimal,
  unique,
  primaryKey,
  varchar,
} from 'drizzle-orm/pg-core';
import { sql } from "drizzle-orm";

import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { nanoid } from '../../../utils';
import { user } from './auth';

export const resourceStatus = pgEnum("resource_status", [
  "draft",
  "published",
  "archived",
  "deleted",
  "pending_review",
  "pending_embedding",
])
// resourceStatus.enumValues

export const resources = pgTable("resources", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  createdBy: text("created_by").references(() => user.id),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),

  content: text("content").notNull(),
  source: text("source"),
  status: resourceStatus("status"),

  metadata: json("metadata").$type<Record<string, any>>().default({}),
});

// Schema for resources - used to validate API requests
export const insertResourceSchema = createSelectSchema(resources)
  .extend({})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

// Type for resources - used to type API request params and within Components
// @ts-expect-error foo
export type NewResourceParams = z.infer<typeof insertResourceSchema>;
