import { pgTable, integer, text, json } from 'drizzle-orm/pg-core';

export * from './schema/resources'
export * from './schema/embeddings'
export * from './schema/auth'


export const cliUsage = pgTable("cli_usage", {
    id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity({ name: "cli_usage_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
    gitUser: text("git_user"),
    template: text("template"),
    metadata: json("metadata"),
    code: text("code"),
});