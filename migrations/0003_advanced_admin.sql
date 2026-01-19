-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER, -- NULL for AI/System
    receiver_id INTEGER, -- Profile ID
    content TEXT NOT NULL,
    is_user_message BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (receiver_id) REFERENCES profiles(id)
);

-- Add last_active to profiles
-- SQLite supports ADD COLUMN
-- ALTER TABLE profiles ADD COLUMN last_active DATETIME;

-- Seed some messages
-- INSERT INTO messages (sender_id, receiver_id, content, is_user_message, created_at) VALUES
-- (NULL, 1, 'Hello! I noticed you like hiking.', FALSE, '2023-10-27 10:00:00'),
-- (101, 1, 'Yes, I love it! Do you hike often?', TRUE, '2023-10-27 10:05:00'),
-- (NULL, 1, 'I try to go every weekend.', FALSE, '2023-10-27 10:06:00');

-- Update some last_active times
UPDATE profiles SET last_active = CURRENT_TIMESTAMP WHERE id IN (1, 2, 3);
