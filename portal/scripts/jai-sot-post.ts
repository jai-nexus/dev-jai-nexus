// portal/scripts/jai-sot-post.ts
import "dotenv/config";

async function main() {
  // argv:
  // [0] = node
  // [1] = script path
  // [2] = ts
  // [3] = source
  // [4] = kind
  // [5...] = summary words
  const [, , ts, source, kind, ...summaryParts] = process.argv;

  if (!ts || !source || !kind) {
    console.error(
      "Usage: npm run sot:post -- <ts> <source> <kind> <summary...>",
    );
    process.exit(1);
  }

  const summary =
    summaryParts.length > 0
      ? summaryParts.join(" ")
      : "No summary provided";

  const body = {
    version: "sot-event-0.1",
    ts,
    source,
    kind,
    summary,
    nhId: "1.0",
  };

  const res = await fetch("http://localhost:3000/api/sot-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("SoT API error:", res.status, text);
    process.exit(1);
  }

  const json = await res.json();
  console.log("SoT event created:", json);
}

main().catch((err) => {
  console.error("jai-sot-post error", err);
  process.exit(1);
});
