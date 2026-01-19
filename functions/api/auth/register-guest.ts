
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

        const dummyEmail = `${userId}@guest.matchlk.com`;

        // Try to insert into users table using a query that covers likely schema variations
        // We assume 0011_add_tracking_columns.sql has been run to add missing columns if needed.
        // If not, this might fail on missing columns, but we must try to capture the data.

        // Note: migrating schemas is tricky without direct DB access. 
        // We included 'email' to satisfy 0001, and 'ip_address' etc for 0007/0011.

        const stmt = db.prepare(`
            INSERT INTO users (user_id, phone, name, email, role, image_url, ip_address, user_agent, country, city, device_type)
            VALUES (?, ?, ?, ?, 'guest', ?, ?, ?, ?, ?, ?)
        `).bind(userId, phone, name, dummyEmail, image, ip, userAgent, country, city, deviceType);

        await stmt.run();


        return new Response(JSON.stringify({ userId, name, phone }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
