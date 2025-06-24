// types.ts - Type definitions for our database interaction

import type { Tool } from "ai";

// Interface for column information
export interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  ordinal_position: number;
}

// Interface for table information
export interface TableInfo {
  table_name: string;
  schema_name?: string; // Optional for SQLite
  columns: ColumnInfo[];
  create_statement: string;
}

// Interface for the database schema
export interface DBSchema {
  tables: TableInfo[];
}


// DBConnection interface (functional approach)
export interface DBConnection {
  getMcpTools: () => Promise<Record<string, Tool>>;
  // Execute a query and return results
  query: (sql: string) => Promise<unknown[]>;

  // Get the database schema information
  getSchema: () => Promise<DBSchema>;

  // Close the connection
  close: () => Promise<void>;
}
