-- Migration number: 0005_add_online_status
-- Description: Add is_online status to profiles table

ALTER TABLE profiles ADD COLUMN is_online BOOLEAN DEFAULT 0;
