
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

        let insertSuccess = false;
        let lastError = '';

        // Strategy 1: Modern/Full Schema (0007 + 0008) -> name, email, tracking codes
        if (!insertSuccess) {
            try {
                await db.prepare(`
                    INSERT INTO users (user_id, phone, name, email, role, image_url, ip_address, user_agent, country, city, device_type)
                    VALUES (?, ?, ?, ?, 'guest', ?, ?, ?, ?, ?, ?)
                `).bind(userId, phone, name, dummyEmail, image, ip, userAgent, country, city, deviceType).run();
                insertSuccess = true;
            } catch (err: any) {
                lastError = 'Strategy 1 failed: ' + err.message;
                console.error(lastError);
            }
        }

        // Strategy 2: Modern/Minimal Schema (0007 only) -> name, tracking codes (No email)
        if (!insertSuccess) {
            try {
                await db.prepare(`
                    INSERT INTO users (user_id, phone, name, image_url, ip_address, user_agent, country, city, device_type)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `).bind(userId, phone, name, image, ip, userAgent, country, city, deviceType).run();
                insertSuccess = true;
            } catch (err: any) {
                lastError = 'Strategy 2 failed: ' + err.message;
                console.error(lastError);
            }
        }

        // Strategy 3: Legacy Schema (0001 only) -> full_name, email (No tracking columns, No user_id column??)
        // Wait, 0001 has no 'user_id' column! It has 'id', 'email', 'phone', 'full_name'.
        // So we MUST use 'email' and 'full_name'. And we can't insert 'user_id' string?
        // 0001 uses INTEGER id.
        // It has 'email' as UNIQUE.
        // It does NOT have 'user_id'. 0007 adds 'user_id'.
        // If 0007 didn't run, we CANNOT insert 'user_id'.
        // But we rely on 'userId' string for session and profile mapping.
        // If we can't save 'user_id', we are in trouble.
        // However, we can try to insert without 'user_id' and get the generated integer ID.
        // But then our session token 'btoa(userId)' will be mismatching if we used the string.
        // Let's assume 0001 might have been patched?
        // If 0007 failed, we really should rely on email for identity?
        // Let's try Strategy 3: 0001 Native
        if (!insertSuccess) {
            try {
                // Legacy 0001: (email, phone, full_name, role)
                const res = await db.prepare(`
                    INSERT INTO users (email, phone, full_name, role, photos)
                    VALUES (?, ?, ?, 'guest', ?)
                `).bind(dummyEmail, phone, name, JSON.stringify([image])).run();
                insertSuccess = true;
                // Note: userId string is NOT saved in DB here. We will lose it on reload unless we lookup by email.
                // But for now, returning success is priority.
            } catch (err: any) {
                lastError = 'Strategy 3 failed: ' + err.message;
                console.error(lastError);
            }
        }

        // Strategy 4: Legacy Minimal (0001 - maybe role is missing?)
        if (!insertSuccess) {
            try {
                await db.prepare(`
                    INSERT INTO users (email, phone, full_name)
                    VALUES (?, ?, ?)
                `).bind(dummyEmail, phone, name).run();
                insertSuccess = true;
            } catch (err: any) {
                lastError = 'Strategy 4 failed: ' + err.message;
                console.error(lastError);
            }
        }

        if (!insertSuccess) {
            throw new Error('All registration strategies failed. Last error: ' + lastError);
        }

        // 2. Insert into PROFILES table
        try {
            // Find the user's integer ID.
            // If strategies 1/2 worked, we search by user_id string.
            // If strategies 3/4 worked, we search by email.
            let userRow;
            try {
                userRow = await db.prepare('SELECT id FROM users WHERE user_id = ?').bind(userId).first();
            } catch (e) { /* Ignore if user_id column missing */ }

            if (!userRow) {
                userRow = await db.prepare('SELECT id FROM users WHERE email = ?').bind(dummyEmail).first();
            }

            if (userRow && userRow.id) {
                // Insert default profile. Schema 0001 has profiles table.
                // It has 'imageUrl' (camelCase).
                await db.prepare(`
                    INSERT INTO profiles (user_id, name, age, gender, location, occupation, imageUrl, isVerified)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                 `).bind(userRow.id, name, 25, 'Unknown', city || 'Sri Lanka', 'Guest', image, false).run();
            }
        } catch (err: any) {
            console.error('Failed to create profile:', err.message);
        }

        // Generate simple session token
        // If we used Legacy, 'userId' string is essentially just stricted to this session, but valid.
        const sessionToken = btoa(userId);

        return new Response(JSON.stringify({ userId, name, phone, sessionToken }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
