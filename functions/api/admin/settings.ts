export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { env } = context;
    try {
        const db = env.DB;
        const results = await db.prepare("SELECT * FROM site_settings").all();
        const settings = results.results.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        return new Response(JSON.stringify(settings), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    try {
        const settings = await request.json() as any;
        const db = env.DB;

        for (const [key, value] of Object.entries(settings)) {
            await db.prepare("INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)")
                .bind(key, value)
                .run();
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
