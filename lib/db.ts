import Database from "better-sqlite3";
import path from "path";
import bcrypt from "bcryptjs";

const DB_PATH = path.join(process.cwd(), "database.sqlite");

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initializeDatabase(db);
  }
  return db;
}

function initializeDatabase(db: Database.Database) {
  // Create registrations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      student_id TEXT NOT NULL UNIQUE,
      grade TEXT NOT NULL,
      nickname TEXT NOT NULL,
      registered_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // Create admin_users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  // Seed default admin if not exists
  const adminExists = db
    .prepare("SELECT id FROM admin_users WHERE username = ?")
    .get("admin");

  if (!adminExists) {
    const hash = bcrypt.hashSync("admin1234", 12);
    const now = new Date().toISOString();
    db.prepare(
      "INSERT INTO admin_users (username, password_hash, created_at) VALUES (?, ?, ?)"
    ).run("admin", hash, now);
    console.log("[DB] Default admin seeded: admin / admin1234");
  }
}

// --- Types ---
export interface Registration {
  id: number;
  first_name: string;
  last_name: string;
  student_id: string;
  grade: string;
  nickname: string;
  registered_at: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

export interface RegistrationInput {
  first_name: string;
  last_name: string;
  student_id: string;
  grade: string;
  nickname: string;
  registered_at: string;
}

export interface RegistrationFilters {
  search?: string;
  grade?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

// --- Registration Queries ---
export function createRegistration(input: RegistrationInput): Registration {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO registrations (first_name, last_name, student_id, grade, nickname, registered_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    input.first_name,
    input.last_name,
    input.student_id,
    input.grade,
    input.nickname,
    input.registered_at,
    now,
    now
  );
  return getRegistrationById(result.lastInsertRowid as number)!;
}

export function getRegistrationById(id: number): Registration | undefined {
  const db = getDb();
  return db
    .prepare("SELECT * FROM registrations WHERE id = ?")
    .get(id) as Registration | undefined;
}

export function getRegistrationByStudentId(
  studentId: string
): Registration | undefined {
  const db = getDb();
  return db
    .prepare("SELECT * FROM registrations WHERE student_id = ?")
    .get(studentId) as Registration | undefined;
}

export function getRegistrations(filters: RegistrationFilters = {}): {
  data: Registration[];
  total: number;
} {
  const db = getDb();
  const {
    search = "",
    grade = "",
    dateFrom = "",
    dateTo = "",
    sortBy = "registered_at",
    sortOrder = "desc",
    page = 1,
    pageSize = 50,
  } = filters;

  const allowedSortColumns: Record<string, string> = {
    registered_at: "registered_at",
    first_name: "first_name",
    last_name: "last_name",
    student_id: "student_id",
    grade: "grade",
  };
  const safeSort = allowedSortColumns[sortBy] ?? "registered_at";
  const safeOrder = sortOrder === "asc" ? "ASC" : "DESC";

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (search) {
    conditions.push(
      "(first_name LIKE ? OR last_name LIKE ? OR student_id LIKE ? OR nickname LIKE ?)"
    );
    const q = `%${search}%`;
    params.push(q, q, q, q);
  }
  if (grade) {
    conditions.push("grade = ?");
    params.push(grade);
  }
  if (dateFrom) {
    conditions.push("DATE(registered_at) >= ?");
    params.push(dateFrom);
  }
  if (dateTo) {
    conditions.push("DATE(registered_at) <= ?");
    params.push(dateTo);
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const total = (
    db
      .prepare(`SELECT COUNT(*) as cnt FROM registrations ${where}`)
      .get(...params) as { cnt: number }
  ).cnt;

  const offset = (page - 1) * pageSize;
  const data = db
    .prepare(
      `SELECT * FROM registrations ${where} ORDER BY ${safeSort} ${safeOrder} LIMIT ? OFFSET ?`
    )
    .all(...params, pageSize, offset) as Registration[];

  return { data, total };
}

export function getStats() {
  const db = getDb();
  const total = (
    db
      .prepare("SELECT COUNT(*) as cnt FROM registrations")
      .get() as { cnt: number }
  ).cnt;

  // Today in Bangkok (UTC+7)
  const now = new Date();
  const bangkokOffset = 7 * 60;
  const bangkokTime = new Date(now.getTime() + bangkokOffset * 60 * 1000);
  const todayDate = bangkokTime.toISOString().slice(0, 10);

  const today = (
    db
      .prepare(
        "SELECT COUNT(*) as cnt FROM registrations WHERE DATE(registered_at) = ?"
      )
      .get(todayDate) as { cnt: number }
  ).cnt;

  const classCount = (
    db
      .prepare(
        "SELECT COUNT(DISTINCT grade) as cnt FROM registrations"
      )
      .get() as { cnt: number }
  ).cnt;

  const latest = db
    .prepare(
      "SELECT first_name, last_name, registered_at FROM registrations ORDER BY registered_at DESC LIMIT 1"
    )
    .get() as { first_name: string; last_name: string; registered_at: string } | undefined;

  return { total, today, classCount, latest };
}

export function getChartData() {
  const db = getDb();

  // Last 7 days by date
  const daily = db
    .prepare(`
      SELECT DATE(registered_at) as date, COUNT(*) as count
      FROM registrations
      WHERE registered_at >= datetime('now', '-6 days')
      GROUP BY DATE(registered_at)
      ORDER BY date ASC
    `)
    .all() as { date: string; count: number }[];

  // By grade
  const byGrade = db
    .prepare(`
      SELECT grade, COUNT(*) as count
      FROM registrations
      GROUP BY grade
      ORDER BY count DESC
    `)
    .all() as { grade: string; count: number }[];

  return { daily, byGrade };
}

// --- Admin Queries ---
export function getAdminByUsername(username: string): AdminUser | undefined {
  const db = getDb();
  return db
    .prepare("SELECT * FROM admin_users WHERE username = ?")
    .get(username) as AdminUser | undefined;
}

export function getDistinctGrades(): string[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT DISTINCT grade FROM registrations ORDER BY grade")
    .all() as { grade: string }[];
  return rows.map((r) => r.grade);
}
