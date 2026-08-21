import { Pool } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

let pool: Pool | null = null;
let isInitialized = false;

function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not set");
    }
    pool = new Pool({ connectionString });
  }
  return pool;
}

export async function initializeDatabase() {
  if (isInitialized) return;
  const p = getPool();

  // Create activities table
  await p.query(`
    CREATE TABLE IF NOT EXISTS activities (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      is_active BOOLEAN DEFAULT true,
      created_at VARCHAR(255) NOT NULL
    )
  `);

  // Create registrations table
  await p.query(`
    CREATE TABLE IF NOT EXISTS registrations (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      student_id VARCHAR(255) NOT NULL UNIQUE,
      grade VARCHAR(50) NOT NULL,
      nickname VARCHAR(255) NOT NULL,
      registered_at VARCHAR(255) NOT NULL,
      created_at VARCHAR(255) NOT NULL,
      updated_at VARCHAR(255) NOT NULL
    )
  `);

  // Add activity_id to registrations if it doesn't exist
  await p.query(`
    ALTER TABLE registrations 
    ADD COLUMN IF NOT EXISTS activity_id INTEGER REFERENCES activities(id)
  `);

  // Create admin_users table
  await p.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at VARCHAR(255) NOT NULL
    )
  `);

  // Seed default admin if not exists
  const adminRes = await p.query(
    "SELECT id FROM admin_users WHERE username = $1",
    ["admin"]
  );

  if (adminRes.rowCount === 0) {
    const hash = bcrypt.hashSync("admin1234", 12);
    const now = new Date().toISOString();
    await p.query(
      "INSERT INTO admin_users (username, password_hash, created_at) VALUES ($1, $2, $3)",
      ["admin", hash, now]
    );
    console.log("[DB] Default admin seeded: admin / admin1234");
  }

  isInitialized = true;
}

// Wrapper to ensure DB is initialized before queries
async function query(text: string, params?: any[]) {
  await initializeDatabase();
  const p = getPool();
  return p.query(text, params);
}

// --- Types ---
export interface Activity {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

export interface Registration {
  id: number;
  first_name: string;
  last_name: string;
  student_id: string;
  grade: string;
  nickname: string;
  activity_id: number | null;
  activity_name?: string;
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
  activity_id: number;
  registered_at: string;
}

export interface RegistrationFilters {
  search?: string;
  grade?: string;
  activityId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

// --- Activity Queries ---
export async function getActivities(): Promise<Activity[]> {
  const res = await query("SELECT * FROM activities ORDER BY created_at DESC");
  return res.rows as Activity[];
}

export async function createActivity(name: string): Promise<Activity> {
  const now = new Date().toISOString();
  const res = await query(
    "INSERT INTO activities (name, created_at) VALUES ($1, $2) RETURNING *",
    [name, now]
  );
  return res.rows[0] as Activity;
}

export async function deleteActivity(id: number): Promise<void> {
  await query("DELETE FROM activities WHERE id = $1", [id]);
}

// --- Registration Queries ---
export async function createRegistration(
  input: RegistrationInput
): Promise<Registration> {
  const now = new Date().toISOString();
  const res = await query(
    `INSERT INTO registrations (first_name, last_name, student_id, grade, nickname, activity_id, registered_at, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      input.first_name,
      input.last_name,
      input.student_id,
      input.grade,
      input.nickname,
      input.activity_id,
      input.registered_at,
      now,
      now,
    ]
  );
  return res.rows[0] as Registration;
}

export async function getRegistrationById(
  id: number
): Promise<Registration | undefined> {
  const res = await query(`
    SELECT r.*, a.name as activity_name 
    FROM registrations r
    LEFT JOIN activities a ON r.activity_id = a.id
    WHERE r.id = $1
  `, [id]);
  return res.rows[0] as Registration | undefined;
}

export async function getRegistrationByStudentId(
  studentId: string
): Promise<Registration | undefined> {
  const res = await query(`
    SELECT r.*, a.name as activity_name 
    FROM registrations r
    LEFT JOIN activities a ON r.activity_id = a.id
    WHERE r.student_id = $1
  `,
    [studentId]
  );
  return res.rows[0] as Registration | undefined;
}

export async function getRegistrations(filters: RegistrationFilters = {}): Promise<{
  data: Registration[];
  total: number;
}> {
  const {
    search = "",
    grade = "",
    activityId = "",
    dateFrom = "",
    dateTo = "",
    sortBy = "registered_at",
    sortOrder = "desc",
    page = 1,
    pageSize = 50,
  } = filters;

  const allowedSortColumns: Record<string, string> = {
    registered_at: "r.registered_at",
    first_name: "r.first_name",
    last_name: "r.last_name",
    student_id: "r.student_id",
    grade: "r.grade",
    activity: "a.name"
  };
  const safeSort = allowedSortColumns[sortBy] ?? "r.registered_at";
  const safeOrder = sortOrder === "asc" ? "ASC" : "DESC";

  const conditions: string[] = [];
  const params: any[] = [];
  let paramIdx = 1;

  if (search) {
    conditions.push(
      `(r.first_name ILIKE $${paramIdx} OR r.last_name ILIKE $${paramIdx} OR r.student_id ILIKE $${paramIdx} OR r.nickname ILIKE $${paramIdx})`
    );
    params.push(`%${search}%`);
    paramIdx++;
  }
  if (grade) {
    conditions.push(`r.grade = $${paramIdx}`);
    params.push(grade);
    paramIdx++;
  }
  if (activityId) {
    conditions.push(`r.activity_id = $${paramIdx}`);
    params.push(parseInt(activityId, 10));
    paramIdx++;
  }
  if (dateFrom) {
    conditions.push(`LEFT(r.registered_at, 10) >= $${paramIdx}`);
    params.push(dateFrom);
    paramIdx++;
  }
  if (dateTo) {
    conditions.push(`LEFT(r.registered_at, 10) <= $${paramIdx}`);
    params.push(dateTo);
    paramIdx++;
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countRes = await query(
    `SELECT COUNT(*) as cnt FROM registrations r ${where}`,
    params
  );
  const total = parseInt(countRes.rows[0].cnt, 10);

  const offset = (page - 1) * pageSize;
  const dataRes = await query(
    `SELECT r.*, a.name as activity_name 
     FROM registrations r
     LEFT JOIN activities a ON r.activity_id = a.id
     ${where} 
     ORDER BY ${safeSort} ${safeOrder} 
     LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
    [...params, pageSize, offset]
  );

  return { data: dataRes.rows as Registration[], total };
}

export async function getStats() {
  const totalRes = await query("SELECT COUNT(*) as cnt FROM registrations");
  const total = parseInt(totalRes.rows[0].cnt, 10);

  // Today in Bangkok (UTC+7)
  const now = new Date();
  const bangkokOffset = 7 * 60;
  const bangkokTime = new Date(now.getTime() + bangkokOffset * 60 * 1000);
  const todayDate = bangkokTime.toISOString().slice(0, 10);

  const todayRes = await query(
    "SELECT COUNT(*) as cnt FROM registrations WHERE LEFT(registered_at, 10) = $1",
    [todayDate]
  );
  const today = parseInt(todayRes.rows[0].cnt, 10);

  // Activity stats instead of class count (or we can return both)
  const activityRes = await query(
    "SELECT COUNT(DISTINCT activity_id) as cnt FROM registrations WHERE activity_id IS NOT NULL"
  );
  const activityCount = parseInt(activityRes.rows[0].cnt, 10);

  const classRes = await query(
    "SELECT COUNT(DISTINCT grade) as cnt FROM registrations"
  );
  const classCount = parseInt(classRes.rows[0].cnt, 10);

  const latestRes = await query(
    `SELECT r.first_name, r.last_name, r.registered_at, a.name as activity_name 
     FROM registrations r
     LEFT JOIN activities a ON r.activity_id = a.id
     ORDER BY r.registered_at DESC LIMIT 1`
  );
  const latest = latestRes.rows[0] as
    | { first_name: string; last_name: string; registered_at: string; activity_name?: string }
    | undefined;

  return { total, today, classCount, activityCount, latest };
}

export async function getChartData() {
  // Last 7 days by date
  const dailyRes = await query(`
    SELECT LEFT(registered_at, 10) as date, COUNT(*)::int as count
    FROM registrations
    WHERE CAST(LEFT(registered_at, 10) AS DATE) >= CURRENT_DATE - INTERVAL '6 days'
    GROUP BY LEFT(registered_at, 10)
    ORDER BY date ASC
  `);
  const daily = dailyRes.rows as { date: string; count: number }[];

  // By activity
  const byActivityRes = await query(`
    SELECT a.name as activity_name, COUNT(r.id)::int as count
    FROM registrations r
    JOIN activities a ON r.activity_id = a.id
    GROUP BY a.name
    ORDER BY count DESC
  `);
  const byActivity = byActivityRes.rows as { activity_name: string; count: number }[];

  // By grade
  const byGradeRes = await query(`
    SELECT grade, COUNT(*)::int as count
    FROM registrations
    GROUP BY grade
    ORDER BY count DESC
  `);
  const byGrade = byGradeRes.rows as { grade: string; count: number }[];

  return { daily, byGrade, byActivity };
}

// --- Admin Queries ---
export async function getAdminByUsername(
  username: string
): Promise<AdminUser | undefined> {
  const res = await query("SELECT * FROM admin_users WHERE username = $1", [
    username,
  ]);
  return res.rows[0] as AdminUser | undefined;
}

export async function getDistinctGrades(): Promise<string[]> {
  const res = await query(
    "SELECT DISTINCT grade FROM registrations ORDER BY grade"
  );
  return res.rows.map((r: any) => r.grade);
}
