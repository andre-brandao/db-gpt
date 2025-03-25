/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql, SQL, type SQLQuery } from "bun";
import type { DBConnection, DBSchema, TableInfo, ColumnInfo } from "./types";

// Define QueryResult type that wasn't in the original types
export interface QueryResult {
  rows?: any[];
  [key: string]: any;
}

export class PostgresConnection implements DBConnection {
  private db: SQL;

  constructor(connectionUrl?: string) {
    this.db = new SQL({
      url: connectionUrl || process.env.PG_URL,
      max: 20,
      idleTimeout: 30,
      connectionTimeout: 30,
      onconnect: () => console.log("Connected to PostgreSQL database"),
      onclose: () => console.log("PostgreSQL connection closed"),
    });
  }

  async query(sql_statment: string): Promise<QueryResult> {
    try {
      const result = await this.db.unsafe(sql_statment);
      return { rows: result };
    } catch (error) {
      console.error("PostgreSQL query error:", error);
      throw error;
    }
  }

  async getSchema(): Promise<DBSchema> {
    // Simplified query that doesn't require custom functions

    try {
      const result = await this.db`
      SELECT 
        t.table_schema,
        t.table_name,
        jsonb_agg(
          jsonb_build_object(
            'column_name', c.column_name,
            'data_type', c.data_type,
            'is_nullable', c.is_nullable,
            'column_default', c.column_default,
            'ordinal_position', c.ordinal_position
          ) ORDER BY c.ordinal_position
        ) AS columns
      FROM information_schema.tables t
      JOIN information_schema.columns c 
        ON t.table_schema = c.table_schema 
        AND t.table_name = c.table_name
      WHERE t.table_schema = 'public'
      AND t.table_type = 'BASE TABLE'
      GROUP BY t.table_schema, t.table_name
      ORDER BY t.table_schema, t.table_name;
    `;

      console.log(result);
      // Transform the result into DBSchema format
      const tables: TableInfo[] =
        result.map((row: any) => {
          const columns: ColumnInfo[] = row.columns;
          return {
            table_name: row.table_name,
            schema_name: row.table_schema,
            columns,
            // Simple placeholder for create_statement
            create_statement: `CREATE TABLE ${row.table_schema}.${row.table_name} (...)`,
          };
        }) ?? [];
      console.log(tables);
      return { tables };
    } catch (error) {
      console.error("Failed to get PostgreSQL schema:", error);
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.db.close();
  }
}
