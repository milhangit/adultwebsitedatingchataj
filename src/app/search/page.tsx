'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get filters from URL
    const gender = searchParams.get('gender') || 'Woman'; // Default to Woman as per UI
    const minAge = parseInt(searchParams.get('minAge') || '18');
    const maxAge = parseInt(searchParams.get('maxAge') || '35');
    const location = searchParams.get('location') || 'Any Location';
    const caste = searchParams.get('caste') || 'Any';
    const religions = searchParams.get('religion')?.split(',') || [];
    const page = parseInt(searchParams.get('page') || '1');
    const ITEMS_PER_PAGE = 6;

    // Filter Logic
    const filteredResults = useMemo(() => {
        return searchResults.filter(profile => {
            // Age Filter
            if (profile.age < minAge || profile.age > maxAge) return false;

            // Location Filter
            if (location !== 'Any Location' && profile.location !== location) return false;

            // Caste Filter
            if (caste !== 'Any' && profile.caste !== caste) return false;

            // Religion Filter
            if (religions.length > 0 && (!profile.religion || !religions.includes(profile.religion))) return false;

            // Gender Filter (Mock data doesn't have gender, assuming names imply gender for now or ignoring)
            // In a real app, we'd filter by gender. For this mock, we'll skip it or infer.
            // Let's assume the user wants to see everyone if they don't specify, or we can add gender to mock data.
            // For now, let's not filter by gender to keep results visible.

            return true;
        });
    }, [minAge, maxAge, location, caste, religions]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
    const paginatedResults = filteredResults.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams?.toString() || '');
        params.set('page', newPage.toString());
        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-1/4">
                <SearchFilters />
            </aside>

            {/* Search Results */}
            <main className="w-full lg:w-3/4">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
                    <span className="text-gray-500 text-sm">
                        Showing {paginatedResults.length} of {filteredResults.length} profiles
                    </span>
                </div>

                {paginatedResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedResults.map((profile) => (
                            <ProfileCard key={profile.id} profile={profile} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <p className="text-gray-500">No profiles found matching your criteria.</p>
                        <button
                            onClick={() => router.push('/search')}
                            className="mt-4 text-primary hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                        <nav className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => handlePageChange(p)}
                                    className={`px-4 py-2 rounded-md ${page === p
                                        ? 'bg-primary text-white'
                                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function SearchPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Suspense fallback={<div>Loading...</div>}>
                    <SearchContent />
                </Suspense>
            </div>
        </div>
    );
}
