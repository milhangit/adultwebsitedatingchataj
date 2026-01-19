'use client';

import { useState } from 'react';
import { Menu, X, Search, Heart, LogIn, UserPlus, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import ActiveMemberCounter from './ActiveMemberCounter';

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
        <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 dark:bg-black/70 shadow-sm border-b border-white/20 dark:border-white/5 supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group shrink-0">
                    <div className="bg-primary p-1.5 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Heart className="w-5 h-5 text-white fill-current" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light hidden md:block" style={{ fontFamily: 'var(--font-outfit)' }}>
                        MatchLK
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center space-x-1">
                    {[
                        { name: t('nav_home'), path: '/' },
                        { name: t('nav_matches'), path: '/matches' },
                        { name: t('nav_profile'), path: '/profile' },
                    ].map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/10 ${isActive(item.path)
                                ? 'bg-primary/10 text-primary font-bold'
                                : 'text-gray-600 dark:text-gray-300 hover:text-primary'
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}

                    {/* Chat Button (Special Style) */}
                    <Link
                        href="/messages"
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${isActive('/messages')
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-black/5 dark:hover:bg-white/10'
                            }`}
                    >
                        <MessageCircle className="w-4 h-4" />
                        {t('nav_messages')}
                    </Link>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-2 sm:gap-3 ml-auto lg:ml-0">
                    <div className="hidden sm:block">
                        <ActiveMemberCounter />
                    </div>

                    <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300 hover:text-primary relative group">
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
                        className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-16 left-0 w-full bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-gray-100 dark:border-white/10 shadow-xl animate-in slide-in-from-top-5 duration-300 h-[calc(100vh-4rem)] overflow-y-auto">
                    <div className="flex flex-col p-4 space-y-4">
                        <div className="py-2 flex justify-center sm:hidden">
                            <ActiveMemberCounter />
                        </div>

                        <div className="space-y-1">
                            {[
                                { name: t('nav_home'), path: '/' },
                                { name: t('nav_matches'), path: '/matches' },
                                { name: t('nav_profile'), path: '/profile' },
                            ].map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block p-4 rounded-xl text-base font-medium transition-colors ${isActive(item.path)
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            {/* Mobile Chat Button */}
                            <Link
                                href="/messages"
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-3 p-4 rounded-xl text-base font-medium transition-colors ${isActive('/messages')
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                                    }`}
                            >
                                <MessageCircle className="w-5 h-5" />
                                {t('nav_messages')}
                            </Link>
                        </div>

                        <div className="border-t border-gray-100 dark:border-white/10 pt-4 grid grid-cols-2 gap-3">
                            <Link
                                href="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-primary bg-primary/5 border border-primary/20"
                            >
                                <LogIn className="w-4 h-4" />
                                {t('nav_login')}
                            </Link>

                            <Link
                                href="/register"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-primary text-white shadow-lg shadow-primary/20"
                            >
                                <UserPlus className="w-4 h-4" />
                                {t('nav_register')}
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
