'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X, Phone, Video, Info, Check, CheckCheck } from 'lucide-react';
import clsx from 'clsx';
import { Profile } from '@/lib/types';
import { apiFetch } from '@/lib/api';
import QuickRegisterModal from './QuickRegisterModal';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'partner';
    timestamp: Date;
    status?: 'sent' | 'delivered' | 'read';
}

interface ChatWindowProps {
    profile: Profile;
    onClose?: () => void;
}

export default function ChatWindow({ profile, onClose }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: `Hi! I'm ${profile.name}. Thanks for reaching out. I'm a ${profile.occupation} based in ${profile.location}. How are you doing?`,
            sender: 'partner',
            timestamp: new Date(),
            status: 'read'
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        setIsLoggedIn(!!userId);
    }, []);

    const handleInputFocus = () => {
        if (!isLoggedIn) {
            setShowRegisterModal(true);
            (document.activeElement as HTMLElement)?.blur();
        }
    };

    const handleRegistrationSuccess = (userId: string) => {
        setIsLoggedIn(true);
        setShowRegisterModal(false);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        const fetchMessages = async () => {
            const userId = localStorage.getItem('user_id');
            if (!userId) return;

            try {
                const res = await apiFetch(`/api/messages?profileId=${profile.id}&userId=${userId}`);
                if (res.ok) {
                    const data = await res.json() as any[];
                    if (data.length > 0) {
                        setMessages(data.map((m: any) => ({
                            id: m.id,
                            text: m.content,
                            sender: m.is_user_message ? 'user' : 'partner',
                            timestamp: new Date(m.created_at),
                            status: 'read'
                        })));
                    }
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        fetchMessages();
    }, [profile.id, isLoggedIn]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userId = localStorage.getItem('user_id');
        if (!userId) return;

        const userMessage: Message = {
            id: Date.now(),
            text: inputText,
            sender: 'user',
            timestamp: new Date(),
            status: 'sent'
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText('');

        // Brief typing simulation for realism
        setTimeout(() => setIsTyping(true), 1000);

        try {
            await apiFetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profile_id: profile.id,
                    user_id: userId,
                    content: userMessage.text,
                    is_user_message: true
                })
            });
        } catch (error) {
            console.error('Error saving message:', error);
        }

        try {
            const res = await apiFetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profileId: profile.id,
                    message: userMessage.text
                })
            });

            if (res.ok) {
                const data = await res.json() as any;

                // Random delay for response realism (2-4 seconds)
                const delay = Math.floor(Math.random() * 2000) + 2000;

                setTimeout(async () => {
                    const partnerMessage: Message = {
                        id: Date.now() + 1,
                        text: data.response,
                        sender: 'partner',
                        timestamp: new Date(),
                    };

                    setMessages((prev) => [...prev, partnerMessage]);
                    setIsTyping(false);

                    await apiFetch('/api/messages', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            profile_id: profile.id,
                            user_id: userId,
                            content: partnerMessage.text,
                            is_user_message: false
                        })
                    });
                }, delay);
            } else {
                setIsTyping(false);
            }
        } catch (error) {
            console.error('Error generating response:', error);
            setIsTyping(false);
        }
    };

    return (
        <>
            <div className="flex flex-col w-full h-full md:h-[600px] md:w-[400px] bg-white md:rounded-2xl shadow-2xl overflow-hidden fixed md:relative inset-0 md:inset-auto z-50 transition-all duration-300 ease-in-out">
                {/* Header - Modern Glassmorphism Styled */}
                <div className="bg-primary text-white p-4 flex justify-between items-center shrink-0 shadow-lg z-10">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img
                                src={profile.imageUrl}
                                alt={profile.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                            />
                            {isOnline && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-primary"></div>
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold text-base leading-tight">{profile.name}</h3>
                            <p className="text-[10px] text-white/70 uppercase tracking-widest font-medium">
                                {isOnline ? 'Active Now' : 'Away'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
                            <Phone className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
                            <Video className="w-5 h-5" />
                        </button>
                        {onClose && (
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Messages Area - Styled like a premium chat app */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f0f2f5] custom-scrollbar">
                    <div className="text-center my-4">
                        <span className="bg-black/5 text-[10px] text-gray-500 px-3 py-1 rounded-full uppercase tracking-tighter">
                            Messages are private & encrypted
                        </span>
                    </div>

                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={clsx(
                                'flex flex-col',
                                msg.sender === 'user' ? 'items-end' : 'items-start'
                            )}
                        >
                            <div
                                className={clsx(
                                    'max-w-[85%] p-3 text-sm shadow-sm transition-all duration-200',
                                    msg.sender === 'user'
                                        ? 'bg-primary text-white rounded-2xl rounded-tr-none premium-shadow'
                                        : 'bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-100'
                                )}
                            >
                                {msg.text}
                            </div>
                            <div className={clsx('flex items-center gap-1 mt-1 px-1', msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                                <span className="text-[9px] text-gray-400">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {msg.sender === 'user' && (
                                    <CheckCheck className="w-3 h-3 text-primary" />
                                )}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex items-start gap-2 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0"></div>
                            <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm italic text-gray-400 text-xs">
                                {profile.name} is typing...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area - Clean & Modern */}
                <div className="p-3 bg-white border-t border-gray-100 shrink-0 safe-area-bottom">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onFocus={handleInputFocus}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={isLoggedIn ? "Message..." : "Sign in to chat"}
                            className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                            readOnly={!isLoggedIn}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputText.trim() || isTyping}
                            className={clsx(
                                "p-2 rounded-full transition-all duration-200",
                                inputText.trim() && !isTyping ? "text-primary hover:scale-110" : "text-gray-300"
                            )}
                        >
                            <Send className="w-5 h-5 fill-current" />
                        </button>
                    </div>
                </div>
            </div>

            {showRegisterModal && (
                <QuickRegisterModal
                    onClose={() => setShowRegisterModal(false)}
                    onSuccess={handleRegistrationSuccess}
                />
            )}
        </>
    );
}
