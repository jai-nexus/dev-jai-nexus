#!/usr/bin/env python3
import os, json, psycopg
url = os.environ.get("DATABASE_URL") or "postgresql://localhost/postgres"
with psycopg.connect(url) as conn:
    cur = conn.cursor()
    cur.execute("SELECT entity, triage, count FROM sot.triage_counts ORDER BY entity, triage NULLS LAST")
    tri = [{"entity":e,"triage":t or "Unspecified","count":int(c)} for e,t,c in cur.fetchall()]
    cur.execute("SELECT id,title,repo,nh_id,epic,triage,due,owner,sot_link,status FROM sot.tasks_export ORDER BY id DESC LIMIT 200")
    tasks = [dict(zip(["id","title","repo","nh_id","epic","triage","due","owner","sot_link","status"], r)) for r in cur.fetchall()]
os.makedirs("data", exist_ok=True)
open("data/sot_triage_counts.json","w").write(json.dumps(tri,indent=2))
open("data/sot_tasks_export.json","w").write(json.dumps(tasks,indent=2))
print("[ok] wrote data/sot_triage_counts.json and data/sot_tasks_export.json")
