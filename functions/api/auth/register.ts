import { isValidSLNumber, formatPhoneNumber } from '../../../src/lib/sl-carriers';

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const { fullName, email, password, gender, mobileNumber } = await request.json() as any;

        if (!fullName || !email || !password || !gender) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        if (mobileNumber && !isValidSLNumber(mobileNumber)) {
            return new Response(JSON.stringify({ error: 'Invalid Sri Lankan mobile number' }), { status: 400 });
        }

        const formattedMobile = mobileNumber ? formatPhoneNumber(mobileNumber) : null;

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
        const lastSeen = Math.floor(Date.now() / 1000);

        // Create User Record
        const insertUser = db.prepare(`
            INSERT INTO users (user_id, name, email, password_hash, gender, role, ip_address, user_agent, country, city, device_type, mobile_number, last_seen)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(userId, fullName, email, passwordHash, gender, 'user', ip, userAgent, country, city, deviceType, formattedMobile, lastSeen);

        // Create Profile Record (for Search/Discovery)
        // Defaulting age to 25 and location to 'Colombo' if unknown to ensure they appear in default searches
        // In a real app, we would ask these during onboarding
        const defaultAge = 25;
        const defaultLocation = 'Colombo';
        const defaultOccupation = 'Member';
        const defaultImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`;

        const insertProfile = db.prepare(`
            INSERT INTO profiles (name, age, gender, location, occupation, imageUrl, isVerified, email, created_at, last_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(fullName, defaultAge, gender, defaultLocation, defaultOccupation, defaultImage, false, email, new Date().toISOString(), new Date().toISOString());

        // Execute as batch
        await db.batch([insertUser, insertProfile]);

        return new Response(JSON.stringify({ success: true, userId }), {
            headers: { 'Content-Type': 'application/json' },
            status: 201
        });

    } catch (error: any) {
        console.error('Registration API Error:', error);

        const errorMessage = error?.message || 'Internal Server Error';

        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
