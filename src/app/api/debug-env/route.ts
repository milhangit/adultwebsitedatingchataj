import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
    try {
        const { env } = getRequestContext();
        return NextResponse.json({
            status: 'ok',
            hasEnv: !!env,
            envKeys: env ? Object.keys(env) : [],
            dbBinding: env && env.DB ? 'Found' : 'Missing',
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
