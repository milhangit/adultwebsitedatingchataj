
import { getDB } from '../../utils/db';

export const onRequestGet: PagesFunction<Env> = async (context) => {
    try {
        const db = getDB(context);
        const { results } = await db.prepare(
            'SELECT * FROM users ORDER BY created_at DESC'
        ).all();

        return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
