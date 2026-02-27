import "dotenv/config";
import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./client.js";

async function main() {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations complete.");
}

main().catch(console.error);
