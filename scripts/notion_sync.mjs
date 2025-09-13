import { writeFileSync } from 'node:fs'
const token = process.env.NOTION_TOKEN
const db    = process.env.NOTION_DATABASE_ID
if(!token || !db){ console.error("NOTION_TOKEN/NOTION_DATABASE_ID not set"); process.exit(1) }
const res = await fetch(`https://api.notion.com/v1/databases/${db}/query`, {
  method:'POST',
  headers:{ 'Authorization':`Bearer ${token}`, 'Notion-Version':'2022-06-28','Content-Type':'application/json' },
  body: JSON.stringify({})
})
if(!res.ok){ console.error(await res.text()); process.exit(1) }
const j = await res.json()
const items = (j.results||[]).map((r)=>({ id:r.id, title:(r.properties?.Name?.title?.[0]?.plain_text||'(untitled)') }))
writeFileSync('data/notion.json', JSON.stringify(items,null,2))
console.log("[ok] wrote data/notion.json")
