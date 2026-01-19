import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
    try {
        const { env } = getRequestContext();
        if (!env.DB) return NextResponse.json({ error: "DB not available" }, { status: 500 });

        // List all tables
        const { results: tables } = await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();

        // Also check columns of 'site_settings' if it exists
        let settingsColumns = null;
        if (tables.some((t: any) => t.name === 'site_settings')) {
            const { results } = await env.DB.prepare("PRAGMA table_info(site_settings)").all();
            settingsColumns = results;
        }

        return NextResponse.json({ tables, settingsColumns });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
