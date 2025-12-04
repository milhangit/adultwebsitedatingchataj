interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);
    const params = url.searchParams;

    const gender = params.get('gender');
    const minAge = parseInt(params.get('minAge') || '18');
    const maxAge = parseInt(params.get('maxAge') || '100');
    const location = params.get('location');
    const caste = params.get('caste');
    const religion = params.get('religion');
    const page = parseInt(params.get('page') || '1');
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
        // Note: This is a simplified count query, ideally should match filters
        // For efficiency in this demo, we might skip complex count or do a separate query
        // Let's do a separate count query with same filters (minus limit/offset)

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

        return new Response(JSON.stringify({
            profiles: results,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(Number(total) / limit)
            }
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
