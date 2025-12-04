interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { env } = context;
    try {
        const totalUsers = await env.DB.prepare('SELECT COUNT(*) as count FROM profiles').first('count');
        const activeMatches = Math.floor(Number(totalUsers) * 0.3); // Mock logic for matches
        const revenue = 4500; // Mock revenue

        return new Response(JSON.stringify({
            totalUsers,
            activeMatches,
            revenue
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
