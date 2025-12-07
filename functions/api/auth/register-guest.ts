
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    try {
        const body = await request.json() as any;
        const { phone, name, image } = body;

        // Simple validation
        if (!phone || !name) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        const ip = request.headers.get('CF-Connecting-IP') || 'Unknown';
        const userAgent = request.headers.get('User-Agent') || 'Unknown';
        const country = request.headers.get('CF-IPCountry') || 'Unknown';
        const city = request.headers.get('CF-IPCity') || 'Unknown';
        // Basic device type detection from UA
        const deviceType = /mobile/i.test(userAgent) ? 'Mobile' : 'Desktop';

        const db = env.DB;
        const userId = 'guest_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

        // Insert into users table
        await db.prepare(`
            INSERT INTO users (user_id, phone, name, image_url, ip_address, user_agent, country, city, device_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(userId, phone, name, image, ip, userAgent, country, city, deviceType).run();

        return new Response(JSON.stringify({ userId, name, phone }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
