import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
    try {
        const { env } = getRequestContext();
        if (!env || !env.DB) {
            return NextResponse.json({}, { status: 200 }); // Graceful fallback
        }
        const db = env.DB;
        const { results } = await db.prepare("SELECT * FROM site_settings").all();
        const settings = results.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        return NextResponse.json(settings || {});
    } catch (error: any) {
        return NextResponse.json({}, { status: 200 });
    }
}
