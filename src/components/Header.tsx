'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Heart, MessageCircle, User, Search } from 'lucide-react';
import clsx from 'clsx';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Search Profiles', href: '/search' },
        { name: 'My Matches', href: '/matches' },
        { name: 'Success Stories', href: '/stories' },
    ];

    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold text-primary tracking-tight">
                            Sithumina
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side Icons/Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="/search" className="text-gray-500 hover:text-primary">
                            <Search className="h-5 w-5" />
                        </Link>
                        <Link href="/messages" className="text-gray-500 hover:text-primary relative">
                            <MessageCircle className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
                        </Link>
                        <Link href="/profile" className="text-gray-500 hover:text-primary">
                            <User className="h-5 w-5" />
                        </Link>
                        <Link
                            href="/login"
                            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-md hover:shadow-lg"
                        >
                            Login
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={clsx('md:hidden', isMenuOpen ? 'block' : 'hidden')}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b border-gray-200">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-gray-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="border-t border-gray-200 pt-4 pb-3">
                        <div className="flex items-center px-5 space-x-4">
                            <Link href="/login" className="w-full text-center bg-primary text-white py-2 rounded-md">
                                Login / Register
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
