export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const { fullName, email, password, gender } = await request.json() as any;

        if (!fullName || !email || !password || !gender) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        const db = env.DB;

        // Check if user exists
        const existingUser = await db.prepare('SELECT email FROM users WHERE email = ?').bind(email).first();
        if (existingUser) {
            return new Response(JSON.stringify({ error: 'Email already registered' }), { status: 409 });
        }

        // Hash password (Simple SHA-256 for this implementation)
        const myText = new TextEncoder().encode(password);
        const myDigest = await crypto.subtle.digest(
            {
                name: 'SHA-256',
            },
            myText
        );
        const passwordHash = [...new Uint8Array(myDigest)]
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');

        const userId = 'user_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
        const ip = request.headers.get('CF-Connecting-IP') || 'Unknown';
        const userAgent = request.headers.get('User-Agent') || 'Unknown';
        const country = request.headers.get('CF-IPCountry') || 'Unknown';
        const city = request.headers.get('CF-IPCity') || 'Unknown';
        const deviceType = /mobile/i.test(userAgent) ? 'Mobile' : 'Desktop';

        await db.prepare(`
            INSERT INTO users (user_id, name, email, password_hash, gender, role, ip_address, user_agent, country, city, device_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(userId, fullName, email, passwordHash, gender, 'user', ip, userAgent, country, city, deviceType).run();

        return new Response(JSON.stringify({ success: true, userId }), {
            headers: { 'Content-Type': 'application/json' },
            status: 201
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
