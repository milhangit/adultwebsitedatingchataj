interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { env } = context;
    try {
        const totalProfiles = await env.DB.prepare('SELECT COUNT(*) as count FROM profiles').first('count');
        const totalUsers = await env.DB.prepare('SELECT COUNT(*) as count FROM users').first('count');

        const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 300;
        const liveUsers = await env.DB.prepare('SELECT COUNT(*) as count FROM users WHERE last_seen > ?').bind(fiveMinutesAgo).first('count');

        const activeMatches = Math.floor(Number(totalProfiles) * 0.3);
        const revenue = 4500;

        return new Response(JSON.stringify({
            totalProfiles,
            totalUsers,     // Real users
            liveUsers,      // Active in last 5 mins
            activeMatches,
            revenue
        }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
