export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { env } = context;
    try {
        const db = env.DB;
        const results = await db.prepare("SELECT * FROM site_settings").all();
        const settings = results.results.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        return new Response(JSON.stringify(settings || {}), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({}), { status: 200 }); // Fail gracefully for public
    }
};
