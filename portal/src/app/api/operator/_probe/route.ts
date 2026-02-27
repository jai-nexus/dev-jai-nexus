import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ ok: true, route: "operator_probe_src_app" });
}
