'use client';

import { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

export default function PWAInstallPrompt() {
    const [show, setShow] = useState(false);
    const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) return;

        // Detect platform
        const userAgent = window.navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(userAgent)) {
            setPlatform('ios');
        } else if (/android/.test(userAgent)) {
            setPlatform('android');
        }

        // Show after a delay if not dismissed
        const isDismissed = localStorage.getItem('pwa_dismissed');
        if (!isDismissed) {
            const timer = setTimeout(() => setShow(true), 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        setShow(false);
        localStorage.setItem('pwa_dismissed', 'true');
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-6 left-4 right-4 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-500">
            <div className="glass premium-shadow p-5 rounded-3xl border border-white/50 max-w-md mx-auto relative overflow-hidden">
                {/* Background accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>

                <button
                    onClick={handleDismiss}
                    className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-black/5"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex gap-4">
                    <div className="bg-primary p-3 rounded-2xl shrink-0 shadow-lg shadow-primary/20">
                        <Download className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 leading-tight">Install DateSL App</h4>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                            {platform === 'ios'
                                ? 'Tap the share icon and select "Add to Home Screen" for a premium mobile experience.'
                                : 'Add DateSL to your home screen for faster access and offline chat.'}
                        </p>

                        {platform === 'ios' && (
                            <div className="flex items-center gap-2 mt-3 text-primary font-semibold text-xs py-1 px-3 bg-primary/10 rounded-full w-fit">
                                <Share className="w-3 h-3" />
                                <span>Follow steps on your browser</span>
                            </div>
                        )}

                        {platform !== 'ios' && (
                            <button
                                onClick={() => {/* Usually handled by beforeinstallprompt event, but simple prompt for now */ }}
                                className="mt-3 bg-primary text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                            >
                                Install Now
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
