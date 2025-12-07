import { getDB } from '../../utils/db';

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request } = context;
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    try {
        const db = getDB(context);
        let query = 'SELECT * FROM profiles';

        if (status !== 'all') {
            query += ' WHERE isVerified = FALSE';
        }

        query += ' ORDER BY created_at DESC';

        const { results } = await db.prepare(query).all();

        return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
    const { request } = context;
    try {
        const { id, updates } = await request.json() as any;

        if (!id || !updates) {
            return new Response(JSON.stringify({ error: 'Missing id or updates' }), { status: 400 });
        }

        const keys = Object.keys(updates);
        const values = Object.values(updates);
        const setClause = keys.map(key => `${key} = ?`).join(', ');

        const db = getDB(context);
        const query = `UPDATE profiles SET ${setClause} WHERE id = ?`;
        const { success } = await db.prepare(query).bind(...values, id).run();

        return new Response(JSON.stringify({ success }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request } = context;
    try {
        const body = await request.json() as any;
        const { action } = body;
        const db = getDB(context);

        if (action === 'approve' || action === 'reject') {
            const { id } = body;
            if (action === 'approve') {
                await db.prepare('UPDATE profiles SET isVerified = TRUE WHERE id = ?').bind(id).run();
            } else if (action === 'reject') {
                await db.prepare('DELETE FROM profiles WHERE id = ?').bind(id).run();
            }
            return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
        } else if (action === 'toggle_online') {
            const { id, is_online } = body;
            await db.prepare('UPDATE profiles SET is_online = ? WHERE id = ?').bind(is_online ? 1 : 0, id).run();
            return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
        } else if (action === 'create') {
            const { profile } = body;
            const { name, age, gender, location, occupation, height, education, imageUrl, bio, family, preferences, religion, caste, email } = profile;

            const { success } = await db.prepare(`
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
