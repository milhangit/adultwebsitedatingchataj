import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { env } = getRequestContext();
        if (!env || !env.DB) {
            return NextResponse.json({ error: "Database not available" }, { status: 500 });
        }

        const profile = await env.DB.prepare('SELECT * FROM profiles WHERE id = ?').bind(id).first();

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        let images = [];
        try {
            if (profile.images) {
                images = JSON.parse(profile.images as string);
            }
        } catch (e) {
            // silent fail
        }

        return NextResponse.json({ ...profile, images });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
