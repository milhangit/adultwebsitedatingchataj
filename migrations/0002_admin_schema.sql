DROP TABLE IF EXISTS profiles;

CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL DEFAULT 'Woman',
    location TEXT NOT NULL,
    occupation TEXT NOT NULL,
    height TEXT,
    education TEXT,
    imageUrl TEXT,
    isVerified BOOLEAN DEFAULT FALSE,
    religion TEXT,
    caste TEXT,
    bio TEXT,
    family TEXT,
    preferences TEXT,
    images TEXT,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reporter_name TEXT NOT NULL,
    reported_profile_id INTEGER NOT NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'Open', -- Open, Resolved, Dismissed
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reported_profile_id) REFERENCES profiles(id)
);

-- Realistic Seed Data for Sri Lankan Market
INSERT INTO profiles (name, age, gender, location, occupation, height, education, imageUrl, isVerified, religion, caste, bio, family, preferences, images, email, created_at, last_active) VALUES 
('Sanduni', 25, 'Woman', 'Colombo 07', 'Senior Software Engineer', '5'' 4"', 'BSc (Hons) in IT', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=600', TRUE, 'Buddhist', 'Govigama', 'I am a career-oriented person who also values traditional Sri Lankan culture. Love exploring nature and trying new cuisines.', 'Father is a doctor (retired), Mother is a teacher. Two siblings.', 'Looking for a professionally qualified person with similar values.', '["https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=600"]', 'sanduni@example.lk', '2023-11-20 10:00:00', '2025-11-30 18:30:00'),
('Arjun', 29, 'Man', 'Kandy', 'Specialist Doctor', '5'' 10"', 'MBBS, MD', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=600', TRUE, 'Buddhist', 'Govigama', 'Dedicated to my profession but I believe in a balanced life. Passionate about hiking in the hill country.', 'Respectable family from Kandy. Father is a lawyer.', 'Seeking an educated and kind-hearted partner.', '["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=600"]', 'arjun@example.lk', '2023-11-25 14:30:00', '2025-11-30 20:15:00'),
('Thilini', 27, 'Woman', 'Negombo', 'Bank Manager', '5'' 3"', 'MBA', 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=400&h=600', TRUE, 'Catholic', 'Karava', 'Independent and cheerful. I love coastal life and spending time with my family.', 'Father owns a business in Negombo. Close-knit family.', 'Looking for an honest and settled individual.', '["https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=400&h=600"]', 'thilini@example.lk', '2023-12-01 09:15:00', '2025-11-30 08:45:00'),
('Dilan', 31, 'Man', 'Colombo', 'Civil Engineer', '5'' 8"', 'B.Eng (Civil)', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=600', TRUE, 'Buddhist', 'Salagama', 'Working in the construction sector. I enjoy cricket and social service activities.', 'Parents are retired government officers.', 'Looking for a simple and cultured partner.', '["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=600"]', 'dilan@example.lk', '2023-12-05 11:20:00', '2025-11-29 22:10:00'),
('Fathima', 24, 'Woman', 'Galle', 'Graphic Designer', '5'' 2"', 'Bachelor of Design', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=600', FALSE, 'Muslim', 'Other', 'Creative soul. Love arts, crafts, and baking.', 'Conservative but supportive Muslim family.', 'Looking for a religious and caring partner.', '["https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=600"]', 'fathima@example.lk', '2023-12-10 16:45:00', '2025-11-30 11:00:00'),
('Kaveen', 30, 'Man', 'Kurunegala', 'Accountant', '5'' 7"', 'ACCA Qualified', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400&h=600', TRUE, 'Buddhist', 'Govigama', 'Professional accountant with a passion for music. I play the guitar in my free time.', 'Middle class family. One younger sister.', 'Looking for a kind and understanding partner.', '["https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400&h=600"]', 'kaveen@example.lk', '2023-12-15 08:00:00', '2025-11-30 07:30:00');

-- Seed Reports
INSERT INTO reports (reporter_name, reported_profile_id, reason, status) VALUES 
('Anonymous', 4, 'Profile details seem inaccurate', 'Open'),
('Arjun', 5, 'Inappropriate communication', 'Resolved');
