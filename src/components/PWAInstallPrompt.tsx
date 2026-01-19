'use client';

import { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

export default function PWAInstallPrompt() {
    const [show, setShow] = useState(false);
    const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

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

        // Handle beforeinstallprompt
        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);

            // Check dismissal before showing
            const isDismissed = localStorage.getItem('pwa_dismissed');
            if (!isDismissed) {
                setShow(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Fallback for iOS which doesn't fire beforeinstallprompt
        const isDismissed = localStorage.getItem('pwa_dismissed');
        if (!deferredPrompt && !isDismissed && (/iphone|ipad|ipod/.test(userAgent))) {
            const timer = setTimeout(() => setShow(true), 3000);
            return () => clearTimeout(timer);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleDismiss = () => {
        setShow(false);
        localStorage.setItem('pwa_dismissed', 'true');
    };

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, discard it
        setDeferredPrompt(null);
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-6 left-4 right-4 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-500">
            <div className="glass premium-shadow p-5 rounded-3xl border border-white/50 max-w-md mx-auto relative overflow-hidden bg-white/90 backdrop-blur-xl dark:bg-black/90 dark:border-white/10">
                {/* Background accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>

                <button
                    onClick={handleDismiss}
                    className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex gap-4">
                    <div className="bg-primary p-3 rounded-2xl shrink-0 shadow-lg shadow-primary/20 flex items-center justify-center h-fit">
                        <Download className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white leading-tight">Install MatchLK App</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                            {platform === 'ios'
                                ? 'Tap the share icon and select "Add to Home Screen" for a premium mobile experience.'
                                : 'Add MatchLK to your home screen for faster access and offline chat.'}
                        </p>

                        {platform === 'ios' && (
                            <div className="flex items-center gap-2 mt-3 text-primary font-semibold text-xs py-1 px-3 bg-primary/10 rounded-full w-fit">
                                <Share className="w-3 h-3" />
                                <span>Follow steps on your browser</span>
                            </div>
                        )}

                        {platform !== 'ios' && (
                            <button
                                onClick={handleInstallClick}
                                className="mt-3 bg-primary text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
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
