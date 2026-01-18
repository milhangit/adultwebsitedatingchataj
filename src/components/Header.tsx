'use client';

import { useState } from 'react';
import { Menu, X, Search, Heart, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const { t } = useLanguage();

    // Hide header on admin pages
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    const isActive = (path: string) => pathname === path;

    return (
        <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/10 dark:bg-black/10 shadow-sm border-b border-white/20">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-primary p-1.5 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Heart className="w-5 h-5 text-white fill-current" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light hidden md:block" style={{ fontFamily: 'var(--font-outfit)' }}>
                        DateSL
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-1">
                    {[
                        { name: t('nav_home'), path: '/' },
                        { name: t('nav_matches'), path: '/matches' },
                        { name: t('nav_messages'), path: '/messages' },
                        { name: t('nav_profile'), path: '/profile' },
                    ].map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/40 ${isActive(item.path)
                                    ? 'bg-white/50 text-primary shadow-sm font-bold'
                                    : 'text-gray-700 hover:text-primary'
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <button className="p-2 rounded-full hover:bg-white/40 transition-colors text-gray-600 hover:text-primary relative group">
                        <Search className="w-5 h-5" />
                    </button>

                    <Link href="/login" className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold text-primary hover:bg-primary/5 transition-all border border-primary/20">
                        <LogIn className="w-4 h-4" />
                        {t('nav_login')}
                    </Link>

                    <Link href="/register" className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold bg-primary text-white hover:bg-primary-dark transition-all shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5">
                        <UserPlus className="w-4 h-4" />
                        {t('nav_register')}
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-xl animate-in slide-in-from-top-5 duration-300">
                    <div className="flex flex-col p-4 space-y-2">
                        {[
                            { name: t('nav_home'), path: '/' },
                            { name: t('nav_matches'), path: '/matches' },
                            { name: t('nav_messages'), path: '/messages' },
                            { name: t('nav_profile'), path: '/profile' },
                            { name: t('nav_login'), path: '/login' },
                            { name: t('nav_register'), path: '/register' },
                        ].map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`p-3 rounded-xl text-base font-medium transition-colors ${isActive(item.path)
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
