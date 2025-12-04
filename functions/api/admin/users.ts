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

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    try {
        const { id, action } = await request.json() as { id: number, action: 'approve' | 'reject' };

        if (!id || !action) {
            return new Response(JSON.stringify({ error: 'Missing id or action' }), { status: 400 });
        }

        if (action === 'approve') {
            await env.DB.prepare('UPDATE profiles SET isVerified = TRUE WHERE id = ?').bind(id).run();
        } else if (action === 'reject') {
            await env.DB.prepare('DELETE FROM profiles WHERE id = ?').bind(id).run();
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
