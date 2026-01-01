
console.log("--- DEBUG ENV ---");
console.log("Runtime Env Database Host:");
try {
    const url = new URL(process.env.DATABASE_URL || "");
    console.log("Host:", url.hostname);
    console.log("DB:", url.pathname);
} catch (e) {
    console.log("Invalid URL:", process.env.DATABASE_URL?.substring(0, 10) + "...");
}

console.log("Direct URL Host:");
try {
    const url = new URL(process.env.DIRECT_URL || "");
    console.log("Host:", url.hostname);
    console.log("DB:", url.pathname);
} catch (e) {
    console.log("Invalid URL");
}
