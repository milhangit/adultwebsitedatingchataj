interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);
    const profileId = url.searchParams.get('profileId');

    if (!profileId) {
        return new Response(JSON.stringify({ error: 'Missing profileId' }), { status: 400 });
    }

    try {
        const { results } = await env.DB.prepare(
            'SELECT * FROM messages WHERE receiver_id = ? ORDER BY created_at ASC'
        ).bind(profileId).all();

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
        const { receiver_id, content, is_user_message } = await request.json() as any;

        if (!receiver_id || !content) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        const { success } = await env.DB.prepare(
            'INSERT INTO messages (receiver_id, content, is_user_message) VALUES (?, ?, ?)'
        ).bind(receiver_id, content, is_user_message).run();

        return new Response(JSON.stringify({ success }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
