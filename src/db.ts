import { createClient } from "@supabase/supabase-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ Connect Drizzle to Supabase via Postgres.js
const sql = postgres(supabaseUrl, { ssl: "require" }); // Ensure SSL is enabled
// export const db = drizzle(sql);



dotenv.config();

export const db = drizzle(process.env.DATABASE_URL!);