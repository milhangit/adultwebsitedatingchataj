-- Migration to ensure users table exists and has tracking fields
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE, -- For guest IDs like 'guest_...'
    phone TEXT,
    name TEXT,
    image_url TEXT,
    ip_address TEXT,
    user_agent TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- If table already existed (from previous partial migrations), we might need to add columns.
-- But since the previous error said "no such table: users", we are likely creating it fresh here for the local DB.
-- If it did exist but with different schema, we'd need ALTER statements, but we'll assume fresh for 'users' based on error.

