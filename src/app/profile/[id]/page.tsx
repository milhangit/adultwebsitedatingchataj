import Image from 'next/image';
import { MapPin, Heart, Shield, CheckCircle } from 'lucide-react';
import ChatSection from '@/components/ChatSection';

// Mock Data
const profiles: Record<string, any> = {
    '1': {
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
        caste: 'Govigama',
        bio: 'I am a kind and ambitious person looking for a partner who values tradition and family. I enjoy cooking traditional Sri Lankan dishes and traveling.',
        family: 'Father is a retired teacher, Mother is a housewife. I have one younger brother.',
        preferences: 'Looking for a professionally qualified partner between 25-30 years, preferably from Colombo or suburbs.',
        images: [
            'https://placehold.co/400x600?text=Dilani+1',
            'https://placehold.co/400x600?text=Dilani+2',
            'https://placehold.co/400x600?text=Dilani+3',
        ]
    },
    // Fallback for other IDs
    'default': {
        id: 99,
        name: 'Sithumina User',
        age: 28,
        location: 'Kandy',
        occupation: 'Teacher',
        height: '5\' 6"',
        education: 'Degree',
        imageUrl: 'https://placehold.co/400x600?text=User',
        isVerified: true,
        religion: 'Buddhist',
        caste: 'Govigama',
        bio: 'Simple and down to earth person.',
        family: 'Respectable family.',
        preferences: 'Looking for a good partner.',
        images: ['https://placehold.co/400x600?text=User']
    }
};

export async function generateStaticParams() {
    return [
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
    ];
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const profile = profiles[id] || profiles['default'];

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
                            <div className="flex items-center gap-3 text-green-600 bg-green-50 p-3 rounded-lg">
                                <Shield className="w-5 h-5" />
                                <span className="font-medium">ID Verified</span>
                            </div>
                            <div className="flex items-center gap-3 text-green-600 bg-green-50 p-3 rounded-lg">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-medium">Phone Verified</span>
                            </div>
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
                                    <ChatSection profileName={profile.name} profileId={profile.id} />
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
