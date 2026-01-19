import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
    try {
        const { env } = getRequestContext();
        if (!env.DB) return NextResponse.json({ error: "DB not available" }, { status: 500 });

        const totalProfiles = await env.DB.prepare('SELECT COUNT(*) as count FROM profiles').first('count');
        const totalUsers = await env.DB.prepare('SELECT COUNT(*) as count FROM users').first('count');

        const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 300;
        const liveUsers = await env.DB.prepare('SELECT COUNT(*) as count FROM users WHERE last_seen > ?').bind(fiveMinutesAgo).first('count');

        const activeMatches = Math.floor(Number(totalProfiles) * 0.3);
        const revenue = 4500; // Mock revenue for now

        return NextResponse.json({
            totalProfiles,
            totalUsers,
            liveUsers,
            activeMatches,
            revenue
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
