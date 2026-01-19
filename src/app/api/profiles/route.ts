import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    let env: any;
    try {
        const ctx = getRequestContext();
        if (!ctx) throw new Error("No context returned from getRequestContext");
        env = ctx.env;
        if (!env) throw new Error("No env found in context");
        if (!env.DB) throw new Error("DB binding missing in env. Available keys: " + Object.keys(env).join(", "));
    } catch (e: any) {
        return NextResponse.json({ error: "Environment Error: " + e.message }, { status: 500 });
    }

    const searchParams = request.nextUrl.searchParams;

    const gender = searchParams.get('gender');
    const minAge = parseInt(searchParams.get('minAge') || '18');
    const maxAge = parseInt(searchParams.get('maxAge') || '100');
    const location = searchParams.get('location');
    const caste = searchParams.get('caste');
    const religion = searchParams.get('religion');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 6;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM profiles WHERE age >= ? AND age <= ?';
    const queryParams: any[] = [minAge, maxAge];

    if (gender && gender !== 'Any') {
        query += ' AND gender = ?';
        queryParams.push(gender);
    }

    if (location && location !== 'Any Location') {
        query += ' AND location = ?';
        queryParams.push(location);
    }

    if (caste && caste !== 'Any') {
        query += ' AND caste = ?';
        queryParams.push(caste);
    }

    if (religion) {
        const religions = religion.split(',');
        if (religions.length > 0) {
            const placeholders = religions.map(() => '?').join(',');
            query += ` AND religion IN (${placeholders})`;
            queryParams.push(...religions);
        }
    }

    // Add pagination
    query += ' LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    try {
        const { results } = await env.DB.prepare(query).bind(...queryParams).all();

        // Get total count for pagination metadata
        let countQuery = 'SELECT COUNT(*) as total FROM profiles WHERE age >= ? AND age <= ?';
        const countParams: any[] = [minAge, maxAge];

        if (gender && gender !== 'Any') {
            countQuery += ' AND gender = ?';
            countParams.push(gender);
        }

        if (location && location !== 'Any Location') {
            countQuery += ' AND location = ?';
            countParams.push(location);
        }

        if (caste && caste !== 'Any') {
            countQuery += ' AND caste = ?';
            countParams.push(caste);
        }

        if (religion) {
            const religions = religion.split(',');
            if (religions.length > 0) {
                const placeholders = religions.map(() => '?').join(',');
                countQuery += ` AND religion IN (${placeholders})`;
                countParams.push(...religions);
            }
        }

        const countResult = await env.DB.prepare(countQuery).bind(...countParams).first();
        const total = countResult?.total || 0;

        const processedResults = results.map((profile: any) => {
            let images = [];
            try {
                if (profile.images) {
                    images = JSON.parse(profile.images);
                }
            } catch (e) {
                // strict silencing of json parse errors
            }
            return { ...profile, images };
        });

        return NextResponse.json({
            profiles: processedResults,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(Number(total) / limit)
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
