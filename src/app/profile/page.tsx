'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Heart, Shield, CheckCircle, Edit3, Camera, Settings, LogOut } from 'lucide-react';
import ChatSection from '@/components/ChatSection';
import { Profile } from '@/lib/types';

function ProfileContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id');

    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isOwnProfile, setIsOwnProfile] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                let url = `/api/profiles/${id}`;

                // If no ID, try to fetch current user ("My Profile" mode)
                if (!id) {
                    url = `/api/user/me`;
                    setIsOwnProfile(true);
                }

                const res = await fetch(url);

                if (!res.ok) {
                    if (res.status === 401 && !id) {
                        // Not logged in and trying to view own profile
                        router.push('/login');
                        return;
                    }
                    if (res.status === 404) throw new Error('Profile not found');
                    throw new Error('Failed to fetch profile');
                }

                const data = await res.json();

                // Handle both public profile format and internal user format
                // The /api/user/me might return slightly different fields (e.g. image_url vs imageUrl)
                // We normalize it here
                const normalizedProfile: Profile = {
                    id: data.id || 0,
                    name: data.name,
                    age: data.age || 25, // Default if missing in Auth data
                    location: data.location || (data.city ? `${data.city}, ${data.country}` : 'Sri Lanka'),
                    occupation: data.occupation || 'Member',
                    height: data.height || '5\' 5"',
                    education: data.education || '-',
                    imageUrl: data.imageUrl || data.image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
                    isVerified: Boolean(data.isVerified),
                    religion: data.religion || '-',
                    caste: data.caste || '-',
                    bio: data.bio || 'No bio yet.',
                    family: data.family || '-',
                    preferences: data.preferences || '-',
                    images: typeof data.images === 'string' ? JSON.parse(data.images) : (data.images || []),
                    is_online: data.is_online
                };

                // Add main image to images list if empty
                if (!normalizedProfile.images || normalizedProfile.images.length === 0) {
                    normalizedProfile.images = [normalizedProfile.imageUrl];
                }

                setProfile(normalizedProfile);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id, router]);

    const handleLogout = () => {
        // Clear cookie by expiring it
        document.cookie = "user_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        window.location.href = '/login';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
                <p className="text-gray-500 mb-6">{error || "The profile you are looking for doesn't exist."}</p>
                <a href="/search" className="text-primary hover:underline">Back to Search</a>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Hero Cover Section */}
            <div className="relative h-64 md:h-80 w-full bg-gradient-to-r from-pink-500 to-purple-600">
                {/* Abstract/Mood Background Image (Optional) */}
                <div className="absolute inset-0 opacity-20">
                    <Image
                        src="https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=3786&auto=format&fit=crop"
                        alt="Background"
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Actions Top Right */}
                {isOwnProfile && (
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all">
                            <Settings className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500/50 transition-all"
                            title="Sign Out"
                        >
                            <LogOut className="w-6 h-6" />
                        </button>
                    </div>
                )}
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Profile Card & Quick Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-6 flex flex-col items-center">
                                <div className="relative w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden mb-4">
                                    <Image
                                        src={profile.imageUrl}
                                        alt={profile.name}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    {isOwnProfile && (
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                            <Camera className="w-8 h-8 text-white" />
                                        </div>
                                    )}
                                </div>

                                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 text-center">
                                    {profile.name}, {profile.age}
                                    {profile.isVerified && <Shield className="w-5 h-5 text-blue-500" fill="currentColor" fillOpacity={0.2} />}
                                </h1>
                                <p className="text-gray-500 flex items-center gap-1 mt-1">
                                    <MapPin className="w-4 h-4" /> {profile.location}
                                </p>

                                <div className="flex gap-3 mt-6 w-full">
                                    {isOwnProfile ? (
                                        <button className="flex-1 py-2 px-4 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                                            <Edit3 className="w-4 h-4" /> Edit Profile
                                        </button>
                                    ) : (
                                        <>
                                            <button className="flex-1 py-2 px-4 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                                                <Heart className="w-4 h-4" /> Connect
                                            </button>
                                            <div className="flex-1">
                                                {/* Chat Section already handles the button UI, we might need to adjust it to fit */}
                                                <ChatSection profile={profile} initialOpen={searchParams.get('openChat') === 'true'} />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Verification Badges */}
                            <div className="bg-gray-50 p-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                                <div className={`flex flex-col items-center p-3 rounded-xl ${profile.isVerified ? 'bg-green-100/50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                    <Shield className="w-6 h-6 mb-1" />
                                    <span className="text-xs font-semibold">ID Verified</span>
                                </div>
                                <div className={`flex flex-col items-center p-3 rounded-xl ${profile.isVerified ? 'bg-green-100/50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                    <CheckCircle className="w-6 h-6 mb-1" />
                                    <span className="text-xs font-semibold">Phone Verified</span>
                                </div>
                            </div>
                        </div>

                        {/* Photos Grid */}
                        <div className="bg-white rounded-2xl shadow-sm p-4">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center justify-between">
                                Photos
                                {isOwnProfile && <span className="text-primary text-xs cursor-pointer hover:underline">Add New</span>}
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {profile.images?.slice(0, 6).map((img: string, idx: number) => (
                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                                        <Image src={img} alt="Gallery" fill className="object-cover" />
                                    </div>
                                ))}
                                {(!profile.images || profile.images.length < 3) && [1, 2, 3].slice(0, 3 - (profile.images?.length || 0)).map((_, i) => (
                                    <div key={`placeholder-${i}`} className="relative aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-gray-300">
                                        <Camera className="w-6 h-6" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Detailed Info */}
                    <div className="lg:col-span-2 space-y-6 pt-12 md:pt-0">
                        {/* Glassmorphism Stats Bar */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-gray-100">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Age</p>
                                    <p className="text-lg font-semibold text-gray-900">{profile.age} Years</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Height</p>
                                    <p className="text-lg font-semibold text-gray-900">{profile.height}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Religion</p>
                                    <p className="text-lg font-semibold text-gray-900">{profile.religion}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Occupation</p>
                                    <p className="text-lg font-semibold text-gray-900 truncate">{profile.occupation}</p>
                                </div>
                            </div>
                        </div>

                        {/* About Me Section */}
                        <div className="bg-white rounded-2xl shadow-sm p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Heart className="w-24 h-24 text-primary rotate-12" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                About Me
                                {profile.is_online && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                        Online Now
                                    </span>
                                )}
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {profile.bio}
                            </p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl shadow-sm p-8">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Personal Details</h2>
                                <ul className="space-y-4">
                                    <li className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="text-gray-500">Education</span>
                                        <span className="font-medium text-gray-900 text-right">{profile.education}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="text-gray-500">Caste</span>
                                        <span className="font-medium text-gray-900 text-right">{profile.caste}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-50 pb-2">
                                        <span className="text-gray-500">Family Status</span>
                                        <span className="font-medium text-gray-900 text-right">{(profile.family?.length || 0) > 20 ? 'Middle Class' : profile.family}</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm p-8">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Partner Preferences</h2>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {profile.preferences}
                                </p>
                            </div>
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
