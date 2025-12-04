'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatWindow from '@/components/ChatWindow';

export default function ChatSection({ profileName, profileId }: { profileName: string, profileId: number }) {
    const [showChat, setShowChat] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowChat(!showChat)}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-teal-200"
            >
                <MessageCircle className="w-5 h-5" />
                {showChat ? 'Close Chat' : 'Chat with AI'}
            </button>

            {showChat && (
                <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    <ChatWindow profileName={profileName} profileId={profileId} />
                </div>
            )}
        </>
    );
}
