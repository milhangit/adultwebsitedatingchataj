import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Briefcase, Ruler, GraduationCap } from 'lucide-react';

interface ProfileProps {
    id: number;
    name: string;
    age: number;
    location: string;
    occupation: string;
    height: string;
    education: string;
    imageUrl: string;
    isVerified?: boolean;
}

export default function ProfileCard({ profile }: { profile: ProfileProps }) {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 group">
            <div className="relative h-64 w-full overflow-hidden">
                <Image
                    src={profile.imageUrl}
                    alt={profile.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <Link
                        href={`/profile/${profile.id}`}
                        className="w-full bg-white/90 backdrop-blur text-primary font-medium py-2 rounded-lg text-center hover:bg-white transition-colors"
                    >
                        View Profile
                    </Link>
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-1">
                            {profile.name}, {profile.age}
                            {profile.isVerified && (
                                <span className="text-blue-500" title="Verified">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            )}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" /> {profile.location}
                        </p>
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600 gap-2">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span>{profile.occupation}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 gap-2">
                        <GraduationCap className="w-4 h-4 text-gray-400" />
                        <span>{profile.education}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 gap-2">
                        <Ruler className="w-4 h-4 text-gray-400" />
                        <span>{profile.height}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
