export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const cookieHeader = request.headers.get('Cookie');

    if (!cookieHeader) {
        return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }

    const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')));
    const userId = cookies['user_session'];

    if (!userId) {
        return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }

    try {
        const db = env.DB;
        const user = await db.prepare('SELECT * FROM users WHERE user_id = ?').bind(userId).first();

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        // Don't return password hash
        const { password_hash, ...safeUser } = user;

        return new Response(JSON.stringify(safeUser), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
