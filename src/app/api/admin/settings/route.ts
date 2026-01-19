import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
    try {
        const { env } = getRequestContext();
        if (!env.DB) return NextResponse.json({ error: "DB not available" }, { status: 500 });

        const results = await env.DB.prepare("SELECT * FROM site_settings").all();
        const settings = results.results.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        return NextResponse.json(settings);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { env } = getRequestContext();
        if (!env.DB) return NextResponse.json({ error: "DB not available" }, { status: 500 });

        const settings = await request.json() as any;

        for (const [key, value] of Object.entries(settings)) {
            await env.DB.prepare("INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)")
                .bind(key, value)
                .run();
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
