'use client';

import { useState } from 'react';

export default function SearchFilters() {
    const [ageRange, setAgeRange] = useState([18, 35]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Filters</h3>

            <div className="space-y-6">
                {/* Gender */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">I'm looking for</label>
                    <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                        <option>Woman</option>
                        <option>Man</option>
                    </select>
                </div>

                {/* Age Range */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-center"
                            placeholder="Min"
                            defaultValue={18}
                        />
                        <span className="text-gray-400">-</span>
                        <input
                            type="number"
                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-center"
                            placeholder="Max"
                            defaultValue={35}
                        />
                    </div>
                </div>

                {/* Religion */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                    <div className="space-y-2">
                        {['Buddhist', 'Hindu', 'Muslim', 'Christian'].map((religion) => (
                            <label key={religion} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                                <span className="text-gray-600 text-sm">{religion}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
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
                    <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                        <option>Any</option>
                        <option>Govigama</option>
                        <option>Karava</option>
                        <option>Salagama</option>
                        <option>Durava</option>
                        <option>Other</option>
                    </select>
                </div>

                <button className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 rounded-lg transition-colors mt-4">
                    Apply Filters
                </button>
            </div>
        </div>
    );
}
