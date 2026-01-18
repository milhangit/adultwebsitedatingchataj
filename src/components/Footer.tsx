'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Heart, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/translations';

export default function Footer() {
    const { t, language, setLanguage } = useLanguage();

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'si', label: 'සිංහල' },
        { code: 'ta', label: 'தமிழ்' }
    ];

    return (
        <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="text-2xl font-bold text-primary tracking-tighter flex items-center">
                            <Heart className="h-6 w-6 mr-1 fill-primary" />
                            <span>DateSL</span>
                        </Link>
                        <p className="mt-4 text-gray-500 text-sm leading-relaxed">
                            {t('footer_about')}
                        </p>

                        {/* Language Switcher */}
                        <div className="mt-6">
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <Globe className="w-3 h-3" /> {t('language_select')}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => setLanguage(lang.code as Language)}
                                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${language === lang.code
                                                ? 'bg-primary text-white border-primary'
                                                : 'text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                                            }`}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">{t('footer_links')}</h3>
                        <ul className="mt-4 space-y-4">
                            <li><Link href="/about" className="text-base text-gray-500 hover:text-primary">About Us</Link></li>
                            <li><Link href="/careers" className="text-base text-gray-500 hover:text-primary">Careers</Link></li>
                            <li><Link href="/blog" className="text-base text-gray-500 hover:text-primary">Blog</Link></li>
                            <li><Link href="/contact" className="text-base text-gray-500 hover:text-primary">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">{t('footer_legal')}</h3>
                        <ul className="mt-4 space-y-4">
                            <li><Link href="/privacy" className="text-base text-gray-500 hover:text-primary">{t('footer_privacy')}</Link></li>
                            <li><Link href="/terms" className="text-base text-gray-500 hover:text-primary">{t('footer_terms')}</Link></li>
                            <li><Link href="/cookies" className="text-base text-gray-500 hover:text-primary">Cookie Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Follow Us</h3>
                        <div className="flex space-x-6 mt-4">
                            <a href="#" className="text-gray-400 hover:text-primary">
                                <span className="sr-only">Facebook</span>
                                <Facebook className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary">
                                <span className="sr-only">Instagram</span>
                                <Instagram className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary">
                                <span className="sr-only">Twitter</span>
                                <Twitter className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary">
                                <span className="sr-only">LinkedIn</span>
                                <Linkedin className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-200 pt-8">
                    <p className="text-base text-gray-400 text-center">
                        &copy; {new Date().getFullYear()} DateSL. {t('footer_copyright')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
