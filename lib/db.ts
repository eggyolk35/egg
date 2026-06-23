import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import type { LineKind } from "./iching/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "readings.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  _db = new Database(DB_PATH);
  _db.exec(`
    CREATE TABLE IF NOT EXISTS readings (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      question         TEXT    NOT NULL DEFAULT '',
      created_at       INTEGER NOT NULL,
      line_kinds       TEXT    NOT NULL,
      primary_id       INTEGER NOT NULL,
      resulting_id     INTEGER,
      changing_positions TEXT  NOT NULL
    )
  `);
  return _db;
}

// ---------- 类型 ----------

export interface ReadingRow {
  id: number;
  question: string;
  created_at: number;
  line_kinds: string;        // JSON LineKind[]
  primary_id: number;
  resulting_id: number | null;
  changing_positions: string; // JSON number[]
}

export interface SaveReadingInput {
  question: string;
  lineKinds: LineKind[];
  primaryId: number;
  resultingId: number | null;
  changingPositions: number[];
}

// ---------- 查询函数 ----------

export function insertReading(input: SaveReadingInput): number {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO readings (question, created_at, line_kinds, primary_id, resulting_id, changing_positions)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    input.question.trim(),
    Date.now(),
    JSON.stringify(input.lineKinds),
    input.primaryId,
    input.resultingId ?? null,
    JSON.stringify(input.changingPositions),
  );
  return result.lastInsertRowid as number;
}

export function listReadings(limit = 50): ReadingRow[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM readings ORDER BY created_at DESC LIMIT ?")
    .all(limit) as ReadingRow[];
}

export function getReadingById(id: number): ReadingRow | undefined {
  const db = getDb();
  return db
    .prepare("SELECT * FROM readings WHERE id = ?")
    .get(id) as ReadingRow | undefined;
}

export function deleteReading(id: number): void {
  getDb().prepare("DELETE FROM readings WHERE id = ?").run(id);
}
