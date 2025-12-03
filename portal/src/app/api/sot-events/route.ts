// portal/src/app/api/sot-events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { recordSotEvent, type SotEventEnvelopeV01 } from '@/lib/sotEvents';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SotEventEnvelopeV01;

    // Fast 400 for obviously bad payloads
    if (!body.ts || !body.source || !body.kind || !body.summary) {
      return NextResponse.json(
        { error: 'Missing required fields (ts, source, kind, summary)' },
        { status: 400 },
      );
    }

    // All version / ts / repo/domain resolution and DB write is centralized
    const created = await recordSotEvent(body);

    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch (err) {
    console.error('sot-events POST error', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
