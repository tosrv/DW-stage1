import { Pool } from "pg";

// DATABASE
const db = new Pool({
  user: "postgres",
  password: "root",
  host: "localhost",
  port: 5432,
  database: "postgres",
  max: 20,
});

export default db;
