'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Heart, Shield, Eye, Users, X } from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';
import AdPlacement from '@/components/AdPlacement';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();
  const [featuredProfiles, setFeaturedProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [stats, setStats] = useState({ views: 0, matches: 0 });
  const [siteSettings, setSiteSettings] = useState<any>({
    site_name: 'MatchLK',
    hero_image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200'
  });

  useEffect(() => {
    // Check login status
    const userId = localStorage.getItem('user_id');
    setIsLoggedIn(!!userId);

    if (userId) {
      // Mock stats for logged in user
      setStats({
        views: Math.floor(Math.random() * 50) + 10,
        matches: Math.floor(Math.random() * 10) + 1
      });
    }

    // Paywall Logic
    const freeUsageCount = parseInt(localStorage.getItem('free_usage_count') || '0');
    const MAX_FREE_USAGE = 10; // Show paywall after 10 visits/actions

    if (!userId) {
      const newCount = freeUsageCount + 1;
      localStorage.setItem('free_usage_count', newCount.toString());

      if (newCount > MAX_FREE_USAGE) {
        // limit reached, redirect to register
        router.push('/register?reason=limit');
      }
    }

    const fetchData = async () => {
      try {
        const [profilesRes, settingsRes] = await Promise.all([
          fetch('/api/profiles?limit=4'),
          fetch('/api/settings')
        ]);

        if (profilesRes.ok) {
          const data = await profilesRes.json() as any;
          setFeaturedProfiles(data.profiles || []);
        }

        if (settingsRes.ok) {
          const settings = await settingsRes.json() as any;
          if (Object.keys(settings).length > 0) {
            setSiteSettings((prev: any) => ({ ...prev, ...settings }));
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Paywall Modal Removed - Redirects to Register instead */}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-dark to-primary py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src={siteSettings.hero_image}
            alt="Background"
            fill
            className="object-cover mix-blend-overlay"
            priority
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 drop-shadow-md whitespace-pre-line">
            {t('hero_title')} <span className="text-secondary-light">{t('hero_title_highlight')}</span>
          </h1>
          <p className="text-xl text-pink-50 max-w-2xl mx-auto mb-10 font-light">
            {t('hero_subtitle')}
          </p>

          {/* Improved Search Box */}
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-2xl max-w-5xl mx-auto flex flex-col md:flex-row gap-4 items-center border border-white/20">
            <div className="flex-1 w-full text-left">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">I'm looking for</label>
              <div className="relative">
                <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 appearance-none font-medium transition-all hover:bg-white">
                  <option>Woman</option>
                  <option>Man</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full text-left">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Age</label>
              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 appearance-none font-medium transition-all hover:bg-white">
                    <option>20</option>
                    <option>25</option>
                    <option>30</option>
                  </select>
                </div>
                <span className="text-gray-400 font-medium">-</span>
                <div className="relative flex-1">
                  <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 appearance-none font-medium transition-all hover:bg-white">
                    <option>30</option>
                    <option>35</option>
                    <option>40</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full text-left">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Religion</label>
              <div className="relative">
                <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 appearance-none font-medium transition-all hover:bg-white">
                  <option>Any</option>
                  <option>Buddhist</option>
                  <option>Hindu</option>
                  <option>Muslim</option>
                  <option>Christian</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <button className="w-full md:w-auto bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 mt-6 md:mt-0">
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>

          {/* Top Ad Banner */}
          {siteSettings.ad_header_script && (
            <div className="mt-12 max-w-4xl mx-auto">
              <AdPlacement scriptHtml={siteSettings.ad_header_script} />
            </div>
          )}
        </div>
      </section>

      {/* Analytics Section (Logged In Only) */}
      {isLoggedIn && (
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{t('auth_welcome')}</h2>
                <p className="text-gray-500">Here's what's happening with your profile.</p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <div className="flex-1 md:w-48 bg-pink-50 p-4 rounded-2xl border border-pink-100 flex items-center gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-primary">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.views}</p>
                    <p className="text-sm text-gray-600">Profile Views</p>
                  </div>
                </div>
                <div className="flex-1 md:w-48 bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-blue-500">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.matches}</p>
                    <p className="text-sm text-gray-600">New Matches</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Profiles */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">New Members</h2>
            <p className="text-gray-500 mt-4">Meet the latest people looking for a partner.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              featuredProfiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))
            )}
          </div>

          {/* Inline Native Ad */}
          {siteSettings.ad_native_inline && (
            <div className="mt-12 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <AdPlacement scriptHtml={siteSettings.ad_native_inline} />
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/search"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-primary bg-white border-primary/20 hover:bg-pink-50 transition-colors shadow-sm"
            >
              View All Profiles
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-3 bg-pink-100 rounded-full mb-6">
              <Heart className="w-6 h-6 text-primary" fill="currentColor" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              "To create the most trusted and dignified platform for Sri Lankans to find their life partners. We believe in the sanctity of marriage and are committed to providing a safe, secure, and culturally respectful environment where genuine connections can flourish."
            </p>

            <div className="mt-6 space-y-2">
              <p className="text-sm text-gray-500 font-medium">
                "ශ්‍රී ලාංකිකයින්ට තම ජීවන සහකරු සොයා ගැනීම සඳහා වඩාත් විශ්වාසවන්ත සහ ගෞරවනීය වේදිකාවක් නිර්මාණය කිරීම."
              </p>
              <p className="text-sm text-gray-500 font-medium">
                "இலங்கையர்கள் தங்கள் வாழ்க்கைத் துணையைத் தேடுவதற்கான மிகவும் நம்பகமான தளம்."
              </p>
            </div>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="font-bold text-gray-900">100% Verified</h3>
                <p className="text-sm text-gray-500 mt-2">Every profile is manually screened</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="font-bold text-gray-900">Secure & Private</h3>
                <p className="text-sm text-gray-500 mt-2">Your data is always protected</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="font-bold text-gray-900">Cultural Focus</h3>
                <p className="text-sm text-gray-500 mt-2">Designed for Sri Lankan values</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-6">{t('hero_title')} {t('hero_title_highlight')}</h2>
          <p className="text-pink-100 mb-8 max-w-2xl mx-auto">
            {t('hero_subtitle')}
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-primary font-bold px-10 py-4 rounded-full hover:bg-gray-100 transition-all shadow-xl transform hover:-translate-y-1"
          >
            {t('hero_cta')}
          </Link>

          {/* Bottom Banner slots */}
          <div className="mt-12 flex flex-col items-center gap-6">
            {siteSettings.ad_banner_468_60 && (
              <div className="hidden md:block">
                <AdPlacement scriptHtml={siteSettings.ad_banner_468_60} />
              </div>
            )}
            {siteSettings.ad_banner_320_50 && (
              <div className="md:hidden">
                <AdPlacement scriptHtml={siteSettings.ad_banner_320_50} />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
