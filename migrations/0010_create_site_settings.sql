-- Migration number: 0010_create_site_settings
-- Create site_settings table for Admin CMS
CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT
);
