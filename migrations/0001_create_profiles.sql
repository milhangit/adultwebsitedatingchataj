-- Drop table for development iteration
DROP TABLE IF EXISTS profiles;

-- Create profiles table
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
    images TEXT -- JSON string of image URLs
);

-- Seed initial data
INSERT INTO profiles (name, age, gender, location, occupation, height, education, imageUrl, isVerified, religion, caste, bio, family, preferences, images) VALUES 
('Dilani', 24, 'Woman', 'Colombo', 'Software Engineer', '5'' 4"', 'Bachelors Degree', 'https://placehold.co/400x600?text=Dilani', TRUE, 'Buddhist', 'Govigama', 'I am a kind and ambitious person looking for a partner who values tradition and family.', 'Father is a retired teacher, Mother is a housewife.', 'Looking for a professionally qualified partner.', '["https://placehold.co/400x600?text=Dilani+1", "https://placehold.co/400x600?text=Dilani+2"]'),
('Sanjay', 28, 'Man', 'Kandy', 'Doctor', '5'' 10"', 'MBBS', 'https://placehold.co/400x600?text=Sanjay', TRUE, 'Buddhist', 'Govigama', 'Dedicated doctor who loves hiking and nature.', 'Respectable family from Kandy.', 'Looking for an educated partner.', '["https://placehold.co/400x600?text=Sanjay+1"]'),
('Fathima', 26, 'Woman', 'Galle', 'Teacher', '5'' 2"', 'Diploma', 'https://placehold.co/400x600?text=Fathima', TRUE, 'Muslim', 'Other', 'Kind hearted teacher who loves children.', 'Conservative Muslim family.', 'Looking for a religious partner.', '["https://placehold.co/400x600?text=Fathima+1"]'),
('Roshan', 30, 'Man', 'Negombo', 'Business Owner', '5'' 8"', 'Masters', 'https://placehold.co/400x600?text=Roshan', TRUE, 'Catholic', 'Karava', 'Entrepreneur with a passion for travel.', 'Business family.', 'Looking for an open minded partner.', '["https://placehold.co/400x600?text=Roshan+1"]'),
('Nishanthi', 25, 'Woman', 'Kurunegala', 'Nurse', '5'' 3"', 'Diploma', 'https://placehold.co/400x600?text=Nishanthi', FALSE, 'Buddhist', 'Govigama', 'Caring nurse working in a private hospital.', 'Middle class family.', 'Looking for a government employee.', '["https://placehold.co/400x600?text=Nishanthi+1"]'),
('Pradeep', 32, 'Man', 'Colombo', 'Banker', '5'' 9"', 'Bachelors', 'https://placehold.co/400x600?text=Pradeep', TRUE, 'Buddhist', 'Salagama', 'Senior banker looking to settle down.', 'Father is a businessman.', 'Looking for a simple girl.', '["https://placehold.co/400x600?text=Pradeep+1"]');
