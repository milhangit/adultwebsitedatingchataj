import { getDB } from '../utils/db';

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request } = context;
    const url = new URL(request.url);
    const profileId = url.searchParams.get('profileId');
    const userId = url.searchParams.get('userId');

    if (!profileId || !userId) {
        return new Response(JSON.stringify({ error: 'Missing profileId or userId' }), { status: 400 });
    }

    try {
        const db = getDB(context);
        const { results } = await db.prepare(
            'SELECT * FROM messages WHERE profile_id = ? AND user_id = ? ORDER BY created_at ASC'
        ).bind(profileId, userId).all();

        return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request } = context;
    try {
        const { profile_id, user_id, content, is_user_message } = await request.json() as any;

        if (!profile_id || !user_id || !content) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        const db = getDB(context);
        const { success } = await db.prepare(
            'INSERT INTO messages (profile_id, user_id, content, is_user_message) VALUES (?, ?, ?, ?)'
        ).bind(profile_id, user_id, content, is_user_message).run();

        return new Response(JSON.stringify({ success }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};

