'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, Heart, Shield, MessageCircle } from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';

export default function Home() {
  const featuredProfiles = [
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
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary-dark py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          {/* Pattern or Background Image could go here */}
          <Image
            src="https://placehold.co/1920x1080?text=Wedding+Background"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
            Find Your Life Partner <br className="hidden md:block" /> in Sri Lanka
          </h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto mb-10">
            Join thousands of Sri Lankans who have found their soulmate through Sithumina.
            Safe, secure, and culturally connected.
          </p>

          {/* Quick Search Box */}
          <div className="bg-white p-4 rounded-2xl shadow-xl max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-gray-500 mb-1 text-left">I'm looking for</label>
              <select className="w-full p-2 border-b border-gray-200 focus:border-primary outline-none bg-transparent text-gray-900">
                <option>Woman</option>
                <option>Man</option>
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-gray-500 mb-1 text-left">Age</label>
              <div className="flex gap-2">
                <select className="w-full p-2 border-b border-gray-200 focus:border-primary outline-none bg-transparent text-gray-900">
                  <option>20</option>
                  <option>25</option>
                  <option>30</option>
                </select>
                <span className="text-gray-400 self-center">to</span>
                <select className="w-full p-2 border-b border-gray-200 focus:border-primary outline-none bg-transparent text-gray-900">
                  <option>30</option>
                  <option>35</option>
                  <option>40</option>
                </select>
              </div>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-gray-500 mb-1 text-left">Religion</label>
              <select className="w-full p-2 border-b border-gray-200 focus:border-primary outline-none bg-transparent text-gray-900">
                <option>Any</option>
                <option>Buddhist</option>
                <option>Hindu</option>
                <option>Muslim</option>
                <option>Christian</option>
              </select>
            </div>
            <button className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Stats / Trust Section */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-teal-50 p-4 rounded-full mb-4 text-primary">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">100% Verified Profiles</h3>
              <p className="text-gray-500 mt-2">We manually screen every profile to ensure safety.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-teal-50 p-4 rounded-full mb-4 text-primary">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Thousands of Matches</h3>
              <p className="text-gray-500 mt-2">Connecting hearts across Sri Lanka every day.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-teal-50 p-4 rounded-full mb-4 text-primary">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">AI-Powered Chat</h3>
              <p className="text-gray-500 mt-2">Get to know matches better with our smart assistant.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Profiles */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">New Members</h2>
            <p className="text-gray-500 mt-4">Meet the latest people looking for a partner.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/search"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-teal-50 hover:bg-teal-100 transition-colors"
            >
              View All Profiles
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to find your soulmate?</h2>
          <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
            Create your profile today and start your journey towards a happy marriage. It's free to get started.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-primary font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          >
            Create Free Profile
          </Link>
        </div>
      </section>
    </div>
  );
}
