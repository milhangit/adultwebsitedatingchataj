import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
    try {
        const { env } = getRequestContext();
        if (!env.DB) return NextResponse.json({ error: "DB not available" }, { status: 500 });

        // Fetch latest 50 messages with profile names
        const { results } = await env.DB.prepare(`
            SELECT m.*, p.name as profile_name 
            FROM messages m 
            JOIN profiles p ON m.profile_id = p.id 
            ORDER BY m.created_at DESC 
            LIMIT 50
        `).all();

        return NextResponse.json(results);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
