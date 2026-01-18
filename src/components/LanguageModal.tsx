'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Check, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/translations';

export default function LanguageModal() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { language, setLanguage } = useLanguage();

    useEffect(() => {
        // Don't show on admin pages
        if (pathname?.startsWith('/admin')) return;

        // Check if language is already selected
        const storedLang = localStorage.getItem('site_language');
        if (!storedLang) {
            // Add a small delay for smooth entrance
            const timer = setTimeout(() => setIsOpen(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [pathname]);

    const handleSelect = (lang: Language) => {
        setLanguage(lang);

        // Slight delay before closing for better UX (so they see the selection)
        setTimeout(() => {
            setIsOpen(false);
        }, 600);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-500 border border-white/20">

                {/* Header with visual flair */}
                <div className="relative bg-primary px-6 py-8 text-center overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-md border border-white/10 shadow-inner">
                            <Globe className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Welcome to DateSL</h2>
                        <p className="text-white/80 text-sm">Please select your preferred language</p>
                    </div>
                </div>

                {/* Options */}
                <div className="p-6 space-y-3 bg-white">
                    {[
                        { code: 'en', label: 'English', native: 'English' },
                        { code: 'si', label: 'Sinhala', native: 'සිංහල' },
                        { code: 'ta', label: 'Tamil', native: 'தமிழ்' }
                    ].map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleSelect(lang.code as Language)}
                            className={`w-full group relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 ${language === lang.code
                                    ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]'
                                    : 'border-gray-100 hover:border-primary/30 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex flex-col items-start">
                                <span className={`text-lg font-bold transition-colors ${language === lang.code ? 'text-primary' : 'text-gray-800'}`}>
                                    {lang.native}
                                </span>
                                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{lang.label}</span>
                            </div>

                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${language === lang.code
                                    ? 'bg-primary text-white shadow-md scale-100'
                                    : 'bg-gray-100 text-gray-300 scale-90 group-hover:scale-95'
                                }`}>
                                {language === lang.code && <Check className="w-5 h-5" />}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="p-4 bg-gray-50 text-center text-xs text-gray-400 border-t border-gray-100">
                    You can change this later in settings
                </div>
            </div>
        </div>
    );
}
