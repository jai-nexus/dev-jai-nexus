
console.log("DB URL:    ", process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':***@'));
console.log("DIRECT URL:", process.env.DIRECT_URL?.replace(/:[^:@]+@/, ':***@'));
console.log("TOKEN:     ", process.env.SOT_INGEST_TOKEN);
