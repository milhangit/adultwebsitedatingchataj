interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { params, env } = context;
    const id = params.id;

    if (!id) {
        return new Response(JSON.stringify({ error: 'Profile ID is required' }), { status: 400 });
    }

    try {
        const profile = await env.DB.prepare('SELECT * FROM profiles WHERE id = ?').bind(id).first();

        if (!profile) {
            return new Response(JSON.stringify({ error: 'Profile not found' }), { status: 404 });
        }

        return new Response(JSON.stringify(profile), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
