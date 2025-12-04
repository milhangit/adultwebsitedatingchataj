'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [gender, setGender] = useState(searchParams.get('gender') || 'Woman');
    const [minAge, setMinAge] = useState(searchParams.get('minAge') || '18');
    const [maxAge, setMaxAge] = useState(searchParams.get('maxAge') || '35');
    const [location, setLocation] = useState(searchParams.get('location') || 'Any Location');
    const [caste, setCaste] = useState(searchParams.get('caste') || 'Any');
    const [religions, setReligions] = useState<string[]>(
        searchParams.get('religion')?.split(',') || []
    );

    const handleReligionChange = (religion: string) => {
        setReligions(prev =>
            prev.includes(religion)
                ? prev.filter(r => r !== religion)
                : [...prev, religion]
        );
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (gender) params.set('gender', gender);
        if (minAge) params.set('minAge', minAge);
        if (maxAge) params.set('maxAge', maxAge);
        if (location && location !== 'Any Location') params.set('location', location);
        if (caste && caste !== 'Any') params.set('caste', caste);
        if (religions.length > 0) params.set('religion', religions.join(','));

        // Reset to page 1 on filter change
        params.set('page', '1');

        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Filters</h3>

            <div className="space-y-6">
                {/* Gender */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">I'm looking for</label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    >
                        <option value="Woman">Woman</option>
                        <option value="Man">Man</option>
                    </select>
                </div>

                {/* Age Range */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={minAge}
                            onChange={(e) => setMinAge(e.target.value)}
                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-center"
                            placeholder="Min"
                        />
                        <span className="text-gray-400">-</span>
                        <input
                            type="number"
                            value={maxAge}
                            onChange={(e) => setMaxAge(e.target.value)}
                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-center"
                            placeholder="Max"
                        />
                    </div>
                </div>

                {/* Religion */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                    <div className="space-y-2">
                        {['Buddhist', 'Hindu', 'Muslim', 'Christian'].map((religion) => (
                            <label key={religion} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={religions.includes(religion)}
                                    onChange={() => handleReligionChange(religion)}
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <span className="text-gray-600 text-sm">{religion}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    >
                        <option>Any Location</option>
                        <option>Colombo</option>
                        <option>Kandy</option>
                        <option>Galle</option>
                        <option>Gampaha</option>
                        <option>Kurunegala</option>
                    </select>
                </div>

                {/* Caste */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Caste</label>
                    <select
                        value={caste}
                        onChange={(e) => setCaste(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    >
                        <option>Any</option>
                        <option>Govigama</option>
                        <option>Karava</option>
                        <option>Salagama</option>
                        <option>Durava</option>
                        <option>Other</option>
                    </select>
                </div>

                <button
                    onClick={applyFilters}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded-lg transition-colors mt-4"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );
}
