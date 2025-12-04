'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatWindow from '@/components/ChatWindow';
import { Profile } from '@/lib/types';

export default function ChatSection({ profile, initialOpen = false }: { profile: Profile; initialOpen?: boolean }) {
    const [showChat, setShowChat] = useState(initialOpen);

    return (
        <>
            <button
                onClick={() => setShowChat(!showChat)}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-teal-200"
            >
                <MessageCircle className="w-5 h-5" />
                {showChat ? 'Close Chat' : 'Send Message'}
            </button>

            {showChat && (
                <div className="fixed inset-0 z-50 md:relative md:inset-auto md:z-auto md:mt-8 animate-in fade-in slide-in-from-bottom-4 md:slide-in-from-top-4 duration-300">
                    <ChatWindow profile={profile} onClose={() => setShowChat(false)} />
                </div>
            )}
        </>
    );
}
