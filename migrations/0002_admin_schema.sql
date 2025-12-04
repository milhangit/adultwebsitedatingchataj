-- Add new columns to profiles if they don't exist (SQLite doesn't support IF NOT EXISTS for columns easily in one statement, so we'll just add them. If this fails in re-run, we handle it or assume fresh start for this demo context, but let's try to be safe or just recreate table for simplicity in this dev phase if needed. 
-- Actually, for this iterative dev, dropping and recreating is cleaner to ensure seed data has the new fields.)

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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

-- Seed Data with Emails and Dates
INSERT INTO profiles (name, age, gender, location, occupation, height, education, imageUrl, isVerified, religion, caste, bio, family, preferences, images, email, created_at) VALUES 
('Dilani', 24, 'Woman', 'Colombo', 'Software Engineer', '5'' 4"', 'Bachelors Degree', 'https://placehold.co/400x600?text=Dilani', TRUE, 'Buddhist', 'Govigama', 'I am a kind and ambitious person looking for a partner who values tradition and family.', 'Father is a retired teacher, Mother is a housewife.', 'Looking for a professionally qualified partner.', '["https://placehold.co/400x600?text=Dilani+1", "https://placehold.co/400x600?text=Dilani+2"]', 'dilani@example.com', '2023-10-01 10:00:00'),
('Sanjay', 28, 'Man', 'Kandy', 'Doctor', '5'' 10"', 'MBBS', 'https://placehold.co/400x600?text=Sanjay', TRUE, 'Buddhist', 'Govigama', 'Dedicated doctor who loves hiking and nature.', 'Respectable family from Kandy.', 'Looking for an educated partner.', '["https://placehold.co/400x600?text=Sanjay+1"]', 'sanjay@example.com', '2023-10-05 14:30:00'),
('Fathima', 26, 'Woman', 'Galle', 'Teacher', '5'' 2"', 'Diploma', 'https://placehold.co/400x600?text=Fathima', TRUE, 'Muslim', 'Other', 'Kind hearted teacher who loves children.', 'Conservative Muslim family.', 'Looking for a religious partner.', '["https://placehold.co/400x600?text=Fathima+1"]', 'fathima@example.com', '2023-10-10 09:15:00'),
('Roshan', 30, 'Man', 'Negombo', 'Business Owner', '5'' 8"', 'Masters', 'https://placehold.co/400x600?text=Roshan', TRUE, 'Catholic', 'Karava', 'Entrepreneur with a passion for travel.', 'Business family.', 'Looking for an open minded partner.', '["https://placehold.co/400x600?text=Roshan+1"]', 'roshan@example.com', '2023-10-12 11:20:00'),
('Nishanthi', 25, 'Woman', 'Kurunegala', 'Nurse', '5'' 3"', 'Diploma', 'https://placehold.co/400x600?text=Nishanthi', FALSE, 'Buddhist', 'Govigama', 'Caring nurse working in a private hospital.', 'Middle class family.', 'Looking for a government employee.', '["https://placehold.co/400x600?text=Nishanthi+1"]', 'nishanthi@example.com', '2023-10-25 16:45:00'), -- Pending verification
('Pradeep', 32, 'Man', 'Colombo', 'Banker', '5'' 9"', 'Bachelors', 'https://placehold.co/400x600?text=Pradeep', TRUE, 'Buddhist', 'Salagama', 'Senior banker looking to settle down.', 'Father is a businessman.', 'Looking for a simple girl.', '["https://placehold.co/400x600?text=Pradeep+1"]', 'pradeep@example.com', '2023-10-28 08:00:00'),
('Kamal', 29, 'Man', 'Matara', 'Engineer', '5'' 7"', 'Bachelors', 'https://placehold.co/400x600?text=Kamal', FALSE, 'Buddhist', 'Govigama', 'Hardworking engineer.', 'Respectable family.', 'Looking for a kind partner.', '["https://placehold.co/400x600?text=Kamal+1"]', 'kamal@example.com', '2023-11-01 12:00:00'); -- Pending verification

-- Seed Reports
INSERT INTO reports (reporter_name, reported_profile_id, reason, status) VALUES 
('Anonymous', 4, 'Fake profile picture', 'Open'),
('Sanjay', 5, 'Inappropriate bio', 'Resolved');
