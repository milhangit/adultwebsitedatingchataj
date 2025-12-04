'use client';

import SearchFilters from '@/components/SearchFilters';
import ProfileCard from '@/components/ProfileCard';
import { Profile } from '@/lib/types';

// Mock data for search results
const searchResults: Profile[] = [
    {
        id: 1,
        name: 'Dilani',
        age: 24,
        location: 'Colombo',
        occupation: 'Software Engineer',
        height: '5\' 4"',
        education: 'Bachelors Degree',
        imageUrl: 'https://placehold.co/400x600?text=Dilani',
        isVerified: true,
        religion: 'Buddhist',
        caste: 'Govigama'
    },
    {
        id: 2,
        name: 'Sanjay',
        age: 28,
        location: 'Kandy',
        occupation: 'Doctor',
        height: '5\' 10"',
        education: 'MBBS',
        imageUrl: 'https://placehold.co/400x600?text=Sanjay',
        isVerified: true,
        religion: 'Buddhist',
        caste: 'Govigama'
    },
    {
        id: 3,
        name: 'Fathima',
        age: 26,
        location: 'Galle',
        occupation: 'Teacher',
        height: '5\' 2"',
        education: 'Diploma',
        imageUrl: 'https://placehold.co/400x600?text=Fathima',
        isVerified: true,
        religion: 'Muslim',
        caste: 'Other'
    },
    {
        id: 4,
        name: 'Roshan',
        age: 30,
        location: 'Negombo',
        occupation: 'Business Owner',
        height: '5\' 8"',
        education: 'Masters',
        imageUrl: 'https://placehold.co/400x600?text=Roshan',
        isVerified: true,
        religion: 'Catholic',
        caste: 'Karava'
    },
    {
        id: 5,
        name: 'Nishanthi',
        age: 25,
        location: 'Kurunegala',
        occupation: 'Nurse',
        height: '5\' 3"',
        education: 'Diploma',
        imageUrl: 'https://placehold.co/400x600?text=Nishanthi',
        isVerified: false,
        religion: 'Buddhist',
        caste: 'Govigama'
    },
    {
        id: 6,
        name: 'Pradeep',
        age: 32,
        location: 'Colombo',
        occupation: 'Banker',
        height: '5\' 9"',
        education: 'Bachelors',
        imageUrl: 'https://placehold.co/400x600?text=Pradeep',
        isVerified: true,
        religion: 'Buddhist',
        caste: 'Salagama'
    }
];

export default function SearchPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-1/4">
                        <SearchFilters />
                    </aside>

                    {/* Search Results */}
                    <main className="w-full lg:w-3/4">
                        <div className="mb-6 flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
                            <span className="text-gray-500 text-sm">Showing {searchResults.length} profiles</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {searchResults.map((profile) => (
                                <ProfileCard key={profile.id} profile={profile} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-12 flex justify-center">
                            <nav className="flex items-center gap-2">
                                <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50">Previous</button>
                                <button className="px-4 py-2 bg-primary text-white rounded-md">1</button>
                                <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">2</button>
                                <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">3</button>
                                <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Next</button>
                            </nav>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
