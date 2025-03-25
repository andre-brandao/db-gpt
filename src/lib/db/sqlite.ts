/* eslint-disable @typescript-eslint/no-explicit-any */
import { Database } from "bun:sqlite";
import type { DBConnection, DBSchema, TableInfo, ColumnInfo } from "./types";

// Define QueryResult type that wasn't in the original types
export interface QueryResult {
  rows?: any[];
  all?: () => any[];
  [key: string]: any;
}

export class SQLiteConnection implements DBConnection {
  private db: Database;
  
  constructor(filePath: string ) {
    this.db = new Database(filePath, {
      create: true,
      readwrite: true,
    });
  }
  
  async query(sql: string ): Promise<QueryResult> {
    try {

      const stmt = this.db.query(sql);
      return {
        rows: stmt.all(),
        all: () => stmt.all(),
        get: () => stmt.get(),
        run: () => stmt.run(),
        finalize: () => stmt.finalize(),
      };
    } catch (error) {
      console.error("SQLite query error:", error);
      throw error;
    }
  }
  
  async getSchema(): Promise<DBSchema> {
    const schemaQuery = `
      SELECT 
        m.tbl_name AS table_name,
        m.sql AS create_statement,
        json_group_array(
          json_object(
            'column_name', p.name,
            'data_type', p.type,
            'is_nullable', CASE WHEN p."notnull" = 0 THEN 'YES' ELSE 'NO' END,
            'column_default', p.dflt_value,
            'ordinal_position', p.cid
          )
        ) AS columns
      FROM 
        sqlite_master m
      JOIN 
        pragma_table_info(m.tbl_name) p
      WHERE 
        m.type = 'table' AND
        m.tbl_name NOT LIKE 'sqlite_%'
      GROUP BY 
        m.tbl_name
      ORDER BY 
        m.tbl_name;
    `;
    
    try {
      const result = await this.query(schemaQuery);
      const rows = result.all ? result.all() : result.rows || [];
      
      // Transform the result into DBSchema format
      const tables: TableInfo[] = rows.map((row: any) => {
        // Parse the JSON string into an array of column objects
        let columns: ColumnInfo[];
        try {
          columns = typeof row.columns === 'string' 
            ? JSON.parse(row.columns) 
            : row.columns;
        } catch (e) {
          console.error("Error parsing columns JSON:", e);
          columns = [];
        }
        
        return {
          table_name: row.table_name,
          columns,
          create_statement: row.create_statement
        };
      });
      
      return { tables };
    } catch (error) {
      console.error("Failed to get SQLite schema:", error);
      throw error;
    }
  }
  
  async close(): Promise<void> {
    this.db.close();
    return Promise.resolve();
  }
}