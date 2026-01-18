-- Migration number: 0003 	 2024-05-22T00:00:00.000Z
-- Add mobile_number and last_seen columns

ALTER TABLE users ADD COLUMN mobile_number TEXT;
ALTER TABLE users ADD COLUMN last_seen INTEGER DEFAULT (strftime('%s', 'now'));
