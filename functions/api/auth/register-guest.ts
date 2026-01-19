
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

        // 1. Insert into USERS table
        try {
            // Attempt 1: Full Schema (with email, role - assuming 0001+0007 hybrid)
            await db.prepare(`
                INSERT INTO users (user_id, phone, name, email, role, image_url, ip_address, user_agent, country, city, device_type)
                VALUES (?, ?, ?, ?, 'guest', ?, ?, ?, ?, ?, ?)
            `).bind(userId, phone, name, dummyEmail, image, ip, userAgent, country, city, deviceType).run();
        } catch (err: any) {
            console.error('Full schema insert failed, trying minimal:', err.message);
            // Attempt 2: Minimal/Tracking Schema (0007 only - no email/role)
            await db.prepare(`
                INSERT INTO users (user_id, phone, name, image_url, ip_address, user_agent, country, city, device_type)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(userId, phone, name, image, ip, userAgent, country, city, deviceType).run();
        }

        // 2. Insert into PROFILES table (Critical for CMS visibility)
        try {
            // We need the INTEGER id of the user we just inserted to link correctly.
            const userRow = await db.prepare('SELECT id FROM users WHERE user_id = ?').bind(userId).first();

            if (userRow && userRow.id) {
                // Insert default profile data
                await db.prepare(`
                    INSERT INTO profiles (user_id, name, age, gender, location, occupation, imageUrl, isVerified)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                 `).bind(userRow.id, name, 25, 'Unknown', city || 'Sri Lanka', 'Guest', image, false).run();
            } else {
                console.error('Could not find user row ID for profile creation');
            }
        } catch (err: any) {
            console.error('Failed to create profile:', err.message);
            // We continue, as user registration is technically successful
        }

        // Generate simple session token (Base64 of userId for this MVP)
        const sessionToken = btoa(userId);

        return new Response(JSON.stringify({ userId, name, phone, sessionToken }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
