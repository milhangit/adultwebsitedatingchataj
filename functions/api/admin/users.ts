interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    try {
        const url = new URL(request.url);
        const status = url.searchParams.get('status');

        let query = 'SELECT * FROM profiles';
        if (status !== 'all') {
            query += ' WHERE isVerified = FALSE';
        }
        query += ' ORDER BY created_at DESC';

        const { results } = await env.DB.prepare(query).all();

        return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    try {
        const { id, updates } = await request.json() as any;

        if (!id || !updates) {
            return new Response(JSON.stringify({ error: 'Missing id or updates' }), { status: 400 });
        }

        // Construct dynamic update query
        const keys = Object.keys(updates);
        const values = Object.values(updates);
        const setClause = keys.map(key => `${key} = ?`).join(', ');

        const query = `UPDATE profiles SET ${setClause} WHERE id = ?`;
        const { success } = await env.DB.prepare(query).bind(...values, id).run();

        return new Response(JSON.stringify({ success }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    try {
        const body = await request.json() as any;
        const { action } = body;

        if (action === 'approve' || action === 'reject') {
            const { id } = body;
            if (action === 'approve') {
                await env.DB.prepare('UPDATE profiles SET isVerified = TRUE WHERE id = ?').bind(id).run();
            } else if (action === 'reject') {
                await env.DB.prepare('DELETE FROM profiles WHERE id = ?').bind(id).run();
            }
            return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
        } else if (action === 'create') {
            const { profile } = body;
            const { name, age, gender, location, occupation, height, education, imageUrl, bio, family, preferences, religion, caste, email } = profile;

            const { success } = await env.DB.prepare(`
                INSERT INTO profiles (name, age, gender, location, occupation, height, education, imageUrl, isVerified, religion, caste, bio, family, preferences, images, email, created_at, last_active)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `).bind(
                name, age, gender, location, occupation, height, education, imageUrl, religion, caste, bio, family, preferences, JSON.stringify([imageUrl]), email
            ).run();

            return new Response(JSON.stringify({ success }), { headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
