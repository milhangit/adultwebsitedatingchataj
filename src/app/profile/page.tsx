'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Heart, Shield, CheckCircle } from 'lucide-react';
import ChatSection from '@/components/ChatSection';
import { Profile } from '@/lib/types';

function ProfileContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            if (!id) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/profiles/${id}`);
                if (!res.ok) {
                    if (res.status === 404) throw new Error('Profile not found');
                    throw new Error('Failed to fetch profile');
                }
                const data = await res.json();

                // Parse images if string
                const parsedProfile = {
                    ...data,
                    images: typeof data.images === 'string' ? JSON.parse(data.images) : data.images,
                    isVerified: Boolean(data.isVerified)
                };

                setProfile(parsedProfile);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!id || error || !profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
                <p className="text-gray-500 mb-6">{error || "The profile you are looking for doesn't exist."}</p>
                <a href="/search" className="text-primary hover:underline">Back to Search</a>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Photos & Quick Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-2">
                            <div className="relative h-[400px] w-full rounded-xl overflow-hidden">
                                <Image
                                    src={profile.imageUrl}
                                    alt={profile.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {profile.images?.slice(0, 3).map((img: string, idx: number) => (
                                    <div key={idx} className="relative h-24 rounded-lg overflow-hidden cursor-pointer hover:opacity-80">
                                        <Image src={img} alt="Gallery" fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                            <h3 className="font-bold text-gray-900">Verification Status</h3>
                            {profile.isVerified ? (
                                <>
                                    <div className="flex items-center gap-3 text-green-600 bg-green-50 p-3 rounded-lg">
                                        <Shield className="w-5 h-5" />
                                        <span className="font-medium">ID Verified</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-green-600 bg-green-50 p-3 rounded-lg">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="font-medium">Phone Verified</span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-3 text-gray-500 bg-gray-50 p-3 rounded-lg">
                                    <Shield className="w-5 h-5" />
                                    <span className="font-medium">Not Verified</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Details & Chat */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header Info */}
                        <div className="bg-white rounded-2xl shadow-sm p-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                        {profile.name}, {profile.age}
                                        {profile.isVerified && <Shield className="w-6 h-6 text-blue-500" fill="currentColor" fillOpacity={0.2} />}
                                    </h1>
                                    <p className="text-gray-500 flex items-center gap-2 mt-2">
                                        <MapPin className="w-4 h-4" /> {profile.location}
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="p-3 rounded-full bg-gray-100 text-gray-500 hover:bg-pink-50 hover:text-pink-500 transition-colors">
                                        <Heart className="w-6 h-6" />
                                    </button>
                                    <ChatSection profile={profile} initialOpen={searchParams.get('openChat') === 'true'} />
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-gray-100 pt-8">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Religion</p>
                                    <p className="font-medium text-gray-900">{profile.religion}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Caste</p>
                                    <p className="font-medium text-gray-900">{profile.caste}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Height</p>
                                    <p className="font-medium text-gray-900">{profile.height}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Education</p>
                                    <p className="font-medium text-gray-900">{profile.education}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Occupation</p>
                                    <p className="font-medium text-gray-900">{profile.occupation}</p>
                                </div>
                            </div>
                        </div>

                        {/* About Me */}
                        <div className="bg-white rounded-2xl shadow-sm p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
                            <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                        </div>

                        {/* Family Details */}
                        <div className="bg-white rounded-2xl shadow-sm p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Family Details</h2>
                            <p className="text-gray-600 leading-relaxed">{profile.family}</p>
                        </div>

                        {/* Partner Preferences */}
                        <div className="bg-white rounded-2xl shadow-sm p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Partner Preferences</h2>
                            <p className="text-gray-600 leading-relaxed">{profile.preferences}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProfileContent />
        </Suspense>
    );
}
