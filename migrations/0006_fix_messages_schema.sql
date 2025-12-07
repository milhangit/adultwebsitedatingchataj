-- Migration to fix messages table for chat support
DROP TABLE IF EXISTS messages;

CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id INTEGER NOT NULL,
    user_id TEXT NOT NULL, -- Supporting string IDs for flexibility or mapped to users.id
    content TEXT NOT NULL,
    is_user_message BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    -- FOREIGN KEY (user_id) REFERENCES users(id) -- Optional if we strictly enforce user table
);

-- Index for faster retrieval by profile and user
CREATE INDEX idx_messages_profile_user ON messages(profile_id, user_id);
