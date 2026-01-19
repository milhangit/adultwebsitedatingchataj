'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { apiFetch } from '@/lib/api';

export default function MessagesPage() {
    const [conversations, setConversations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            setLoading(false);
            return;
        }
        setIsAuthenticated(true);

        const fetchConversations = async () => {
            try {
                const res = await apiFetch(`/api/conversations?userId=${userId}`);
                if (res.ok) {
                    const data = await res.json() as any[];
                    setConversations(data);
                }
            } catch (error) {
                console.error('Error fetching conversations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
                    <p className="text-gray-600 mb-8">You need to be logged in to view your messages.</p>
                    <Link href="/login" className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary-dark transition-colors">
                        Log In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {conversations.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No messages yet. Start chatting!</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {conversations.map((chat) => (
                            <Link key={chat.id} href={`/profile?id=${chat.id}&openChat=true`} className="block hover:bg-gray-50 transition-colors">
                                <div className="p-4 flex items-center gap-4">
                                    <div className="relative w-12 h-12 flex-shrink-0">
                                        <Image
                                            src={chat.imageUrl}
                                            alt={chat.name}
                                            fill
                                            className="object-cover rounded-full"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="text-base font-semibold text-gray-900 truncate">{chat.name}</h3>
                                            <span className="text-xs text-gray-500">{new Date(chat.lastMessageTime).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 truncate">
                                            {chat.is_user_message ? 'You: ' : ''}{chat.lastMessage}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
