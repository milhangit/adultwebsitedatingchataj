import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
    try {
        const { env } = getRequestContext();
        if (!env.DB) return NextResponse.json({ error: "DB not available" }, { status: 500 });

        const { results } = await env.DB.prepare(
            'SELECT * FROM reports ORDER BY created_at DESC'
        ).all();

        return NextResponse.json(results);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
