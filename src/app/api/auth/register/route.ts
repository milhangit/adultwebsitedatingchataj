import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Helper functions inline to avoid import issues
type Carrier = 'Dialog' | 'Mobitel' | 'Hutch' | 'Airtel' | 'Unknown';

const getCarrier = (phoneNumber: string): Carrier => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    let prefix = '';
    if (cleaned.length === 10 && cleaned.startsWith('0')) {
        prefix = cleaned.substring(1, 3);
    } else if (cleaned.length === 9) {
        prefix = cleaned.substring(0, 2);
    } else {
        return 'Unknown';
    }
    const p = parseInt(prefix);
    if ([77, 76, 74].includes(p)) return 'Dialog';
    if ([71, 70].includes(p)) return 'Mobitel';
    if ([78, 72].includes(p)) return 'Hutch';
    if ([75].includes(p)) return 'Airtel';
    return 'Unknown';
};

const isValidSLNumber = (phoneNumber: string): boolean => {
    const carrier = getCarrier(phoneNumber);
    const cleaned = phoneNumber.replace(/\D/g, '');
    return carrier !== 'Unknown' && (cleaned.length === 9 || (cleaned.length === 10 && cleaned.startsWith('0')));
}

const formatPhoneNumber = (phoneNumber: string): string => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length === 10 && cleaned.startsWith('0')) return cleaned;
    if (cleaned.length === 9) return `0${cleaned}`;
    return phoneNumber;
}

export async function POST(req: NextRequest) {
    try {
        const { fullName, email, password, gender, mobileNumber } = await req.json() as any;

        if (!fullName || !email || !password || !gender) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (mobileNumber && !isValidSLNumber(mobileNumber)) {
            return NextResponse.json({ error: 'Invalid Sri Lankan mobile number' }, { status: 400 });
        }

        const formattedMobile = mobileNumber ? formatPhoneNumber(mobileNumber) : null;

        // Access D1 via getRequestContext
        const { env } = getRequestContext();
        const db = env.DB;

        // Check if user exists
        const existingUser = await db.prepare('SELECT email FROM users WHERE email = ?').bind(email).first();
        if (existingUser) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
        }

        // Hash password
        const myText = new TextEncoder().encode(password);
        const myDigest = await crypto.subtle.digest(
            { name: 'SHA-256' },
            myText
        );
        const passwordHash = [...new Uint8Array(myDigest)]
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');

        const userId = 'user_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
        const ip = req.headers.get('CF-Connecting-IP') || 'Unknown';
        const userAgent = req.headers.get('User-Agent') || 'Unknown';
        const country = req.headers.get('CF-IPCountry') || 'Unknown';
        const city = req.headers.get('CF-IPCity') || 'Unknown';
        const deviceType = /mobile/i.test(userAgent) ? 'Mobile' : 'Desktop';
        const lastSeen = Math.floor(Date.now() / 1000);

        // Create User Record
        const insertUser = db.prepare(`
            INSERT INTO users (user_id, name, email, password_hash, gender, role, ip_address, user_agent, country, city, device_type, phone, last_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(userId, fullName, email, passwordHash, gender, 'user', ip, userAgent, country, city, deviceType, formattedMobile, new Date().toISOString());

        // Create Profile Record
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

        return NextResponse.json({ success: true, userId }, { status: 201 });

    } catch (error: any) {
        console.error('Registration API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
