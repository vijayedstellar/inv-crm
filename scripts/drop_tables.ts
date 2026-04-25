import postgres from "postgres";

async function main() {
  const sql = postgres(process.env.DATABASE_URL!);
  const tables = await sql`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  `;
  console.log("Tables found:", tables.map((r) => r.tablename).join(", "));
  for (const row of tables) {
    await sql.unsafe(`DROP TABLE IF EXISTS "${row.tablename}" CASCADE`);
    console.log(`Dropped: ${row.tablename}`);
  }
  await sql.end();
  console.log("All tables dropped.");
}

main().catch((e) => { console.error(e); process.exit(1); });
