interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { env } = context;
    try {
        // Fetch latest 50 messages with profile names
        const { results } = await env.DB.prepare(`
            SELECT m.*, p.name as profile_name 
            FROM messages m 
            JOIN profiles p ON m.profile_id = p.id 
            ORDER BY m.created_at DESC 
            LIMIT 50
        `).all();

        return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
