const fs = require('fs');
const path = require('path');

// Sri Lankan Data Arrays
const firstNamesFemale = ['Dilani', 'Fathima', 'Ayesha', 'Chamari', 'Nishanthi', 'Priyanka', 'Sanduni', 'Tharushi', 'Kavindi', 'Rashmi', 'Shalini', 'Menaka', 'Ruwanthi', 'Gayani', 'Hiruni'];
const firstNamesMale = ['Sanjay', 'Nuwan', 'Kasun', 'Lahiru', 'Chathura', 'Roshan', 'Kamal', 'Nimal', 'Ruwan', 'Mahesh', 'Dinesh', 'Pradeep', 'Sampath', 'Tharindu', 'Asanka'];
const lastNames = ['Perera', 'Silva', 'Fernando', 'De Silva', 'Bandara', 'Jayasinghe', 'Wickramasinghe', 'Ratnayake', 'Herath', 'Dissanayake', 'Rajapaksa', 'Gunawardena', 'Liyanage', 'Ekanayake', 'Gamage'];
const locations = ['Colombo', 'Kandy', 'Galle', 'Matara', 'Negombo', 'Jaffna', 'Anuradhapura', 'Kurunegala', 'Ratnapura', 'Badulla', 'Gampaha', 'Kalutara', 'Batticaloa', 'Trincomalee', 'Matale'];
const religions = ['Buddhist', 'Hindu', 'Muslim', 'Christian'];
const castes = ['Govigama', 'Karava', 'Salagama', 'Durava', 'Vellalar', 'Other'];
const occupations = ['Teacher', 'Engineer', 'Doctor', 'Nurse', 'Accountant', 'Software Engineer', 'Student', 'Business Owner', 'Banker', 'Lawyer', 'Architect', 'Chef', 'Civil Servant', 'Artist', 'Writer'];
const educations = ['High School', 'Diploma', 'Bachelors Degree', 'Masters Degree', 'PhD', 'Associate Degree'];

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProfiles(count) {
    const profiles = [];
    for (let i = 0; i < count; i++) {
        const isFemale = i < (count * 0.8); // 80% female
        const gender = isFemale ? 'Female' : 'Male';
        const firstName = getRandomElement(isFemale ? firstNamesFemale : firstNamesMale);
        const lastName = getRandomElement(lastNames);
        const fullName = `${firstName} ${lastName}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
        
        const profile = {
            email,
            password_hash: 'seeded_hash', // Placeholder
            phone: `+947${getRandomInt(0, 9)}${getRandomInt(1000000, 9999999)}`,
            full_name: fullName,
            gender,
            dob: new Date(Date.now() - getRandomInt(18, 35) * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            height: getRandomInt(150, 190),
            education: getRandomElement(educations),
            occupation: getRandomElement(occupations),
            religion: getRandomElement(religions),
            caste: getRandomElement(castes),
            location: getRandomElement(locations),
            bio: `I am a ${getRandomElement(['kind', 'caring', 'ambitious', 'family-oriented'])} person looking for a partner who values ${getRandomElement(['tradition', 'honesty', 'family', 'education'])}. I enjoy ${getRandomElement(['cooking', 'traveling', 'reading', 'music'])} and spending time with loved ones.`,
            photos: JSON.stringify([`https://placehold.co/400x600?text=${firstName}`]),
            is_verified: true,
            role: 'user',
            is_seeded: true,
            family_details: JSON.stringify({ father: 'Retired', mother: 'Housewife', siblings: getRandomInt(0, 3) }),
            preferences: JSON.stringify({ age_range: [18, 40], religion: 'Any' })
        };
        profiles.push(profile);
    }
    return profiles;
}

const seededProfiles = generateProfiles(400);
const outputPath = path.join(__dirname, 'seeded_profiles.json');

fs.writeFileSync(outputPath, JSON.stringify(seededProfiles, null, 2));
console.log(`Generated ${seededProfiles.length} profiles to ${outputPath}`);

// Generate SQL insert statements
const sqlPath = path.join(__dirname, 'seed.sql');
let sqlContent = '';

seededProfiles.forEach(p => {
    sqlContent += `INSERT INTO users (email, password_hash, phone, full_name, gender, dob, height, education, occupation, religion, caste, location, bio, photos, is_verified, role, is_seeded) VALUES ('${p.email}', '${p.password_hash}', '${p.phone}', '${p.full_name}', '${p.gender}', '${p.dob}', ${p.height}, '${p.education}', '${p.occupation}', '${p.religion}', '${p.caste}', '${p.location}', '${p.bio.replace(/'/g, "''")}', '${p.photos}', 1, 'user', 1);\n`;
});

// Note: This SQL assumes we insert into profiles table separately or use a trigger. 
// For simplicity in this script, we'll just insert into users. 
// In a real scenario, we'd need to insert into profiles table too using the returned IDs.
// Since D1 doesn't support returning IDs easily in batch, we might need a more complex script.
// For now, let's just generate the user inserts.

fs.writeFileSync(sqlPath, sqlContent);
console.log(`Generated SQL to ${sqlPath}`);
