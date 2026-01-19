import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    try {
        const { env } = getRequestContext();
        const url = new URL(request.url);
        const status = url.searchParams.get('status');

        if (!env.DB) return NextResponse.json({ error: "DB not available" }, { status: 500 });

        let query = 'SELECT * FROM profiles';
        if (status !== 'all') {
            query += ' WHERE isVerified = FALSE';
        }
        query += ' ORDER BY created_at DESC';

        const { results } = await env.DB.prepare(query).all();
        return NextResponse.json(results);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { env } = getRequestContext();
        const { id, updates } = await request.json() as any;

        if (!env.DB) return NextResponse.json({ error: "DB not available" }, { status: 500 });
        if (!id || !updates) {
            return NextResponse.json({ error: 'Missing id or updates' }, { status: 400 });
        }

        // Whitelist allowed columns to prevent "no such column" errors
        const allowedColumns = [
            'name', 'age', 'gender', 'location', 'occupation', 'height', 'education',
            'imageUrl', 'isVerified', 'religion', 'caste', 'bio', 'family',
            'preferences', 'images', 'email', 'last_active', 'is_online'
        ];

        const keys = Object.keys(updates).filter(k => allowedColumns.includes(k));
        if (keys.length === 0) {
            return NextResponse.json({ error: 'No valid update fields provided' }, { status: 400 });
        }

        const values = keys.map(k => updates[k]);
        const setClause = keys.map(key => `${key} = ?`).join(', ');

        const query = `UPDATE profiles SET ${setClause} WHERE id = ?`;
        const { success } = await env.DB.prepare(query).bind(...values, id).run();

        return NextResponse.json({ success });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { env } = getRequestContext();
        const body = await request.json() as any;
        const { action } = body;

        if (!env.DB) return NextResponse.json({ error: "DB not available" }, { status: 500 });

        if (action === 'approve' || action === 'reject') {
            const { id } = body;
            if (action === 'approve') {
                await env.DB.prepare('UPDATE profiles SET isVerified = TRUE WHERE id = ?').bind(id).run();
            } else if (action === 'reject') {
                await env.DB.prepare('DELETE FROM profiles WHERE id = ?').bind(id).run();
            }
            return NextResponse.json({ success: true });
        } else if (action === 'toggle_online') {
            const { id, is_online } = body;
            await env.DB.prepare('UPDATE profiles SET is_online = ? WHERE id = ?').bind(is_online ? 1 : 0, id).run();
            return NextResponse.json({ success: true });
        } else if (action === 'create') {
            const { profile } = body;
            const { name, age, gender, location, occupation, height, education, imageUrl, bio, family, preferences, religion, caste, email } = profile;

            const { success } = await env.DB.prepare(`
                INSERT INTO profiles (name, age, gender, location, occupation, height, education, imageUrl, isVerified, religion, caste, bio, family, preferences, images, email, created_at, last_active)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `).bind(
                name, age, gender, location, occupation, height, education, imageUrl, religion, caste, bio, family, preferences, JSON.stringify([imageUrl]), email
            ).run();

            return NextResponse.json({ success });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
