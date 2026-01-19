'use client';

import { Suspense, useMemo, useState, useEffect } from 'react'; // Added useState, useEffect
import { useSearchParams, useRouter } from 'next/navigation';
import SearchFilters from '@/components/SearchFilters';
import ProfileCard from '@/components/ProfileCard';
import { Profile } from '@/lib/types';
import { Filter } from 'lucide-react'; // Added Icon

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [showFilters, setShowFilters] = useState(false); // Mobile filter state

    // Get filters from URL for API call
    const gender = searchParams.get('gender') || 'Woman';
    const minAge = searchParams.get('minAge') || '18';
    const maxAge = searchParams.get('maxAge') || '35';
    const location = searchParams.get('location') || 'Any Location';
    const caste = searchParams.get('caste') || 'Any';
    const religion = searchParams.get('religion') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
        const fetchProfiles = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (gender) params.set('gender', gender);
                if (minAge) params.set('minAge', minAge);
                if (maxAge) params.set('maxAge', maxAge);
                if (location && location !== 'Any Location') params.set('location', location);
                if (caste && caste !== 'Any') params.set('caste', caste);
                if (religion) params.set('religion', religion);
                params.set('page', page.toString());

                const res = await fetch(`/api/profiles?${params.toString()}`);
                if (res.ok) {
                    const data = await res.json() as any;
                    setProfiles(data.profiles || []);
                    setTotal(data.pagination?.total || 0);
                }
            } catch (error) {
                console.error('Error fetching profiles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfiles();
    }, [searchParams]);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams?.toString() || '');
        params.set('page', newPage.toString());
        router.push(`/search?${params.toString()}`);
    };

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    return (
        <div className="flex flex-col lg:flex-row gap-8 relative">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm text-gray-700 font-medium w-full justify-center"
                >
                    <Filter className="w-4 h-4" />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
            </div>

            {/* Sidebar Filters - Responsive */}
            <aside className={`w-full lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <SearchFilters />
            </aside>

            {/* Search Results */}
            <main className="w-full lg:w-3/4">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
                    <span className="text-gray-500 text-sm">
                        Showing {profiles.length} of {total} profiles
                    </span>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : profiles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {profiles.map((profile) => (
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
