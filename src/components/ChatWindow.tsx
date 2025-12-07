'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Minimize2 } from 'lucide-react';
import clsx from 'clsx';
import { Profile } from '@/lib/types';
import { apiFetch } from '@/lib/api';
import QuickRegisterModal from './QuickRegisterModal';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

interface ChatWindowProps {
    profile: Profile;
    onClose?: () => void;
}

export default function ChatWindow({ profile, onClose }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: `Hi! Thanks for visiting my profile. I'm ${profile.name}. Feel free to ask me anything about my work as a ${profile.occupation} or my interests!`,
            sender: 'ai',
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        setIsLoggedIn(!!userId);
    }, []);

    const handleInputFocus = () => {
        if (!isLoggedIn) {
            setShowRegisterModal(true);
            // Blur input to prevent typing
            (document.activeElement as HTMLElement)?.blur();
        }
    };

    const handleRegistrationSuccess = (userId: string) => {
        setIsLoggedIn(true);
        setShowRegisterModal(false);
        // Optionally reload or just continue
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Fetch initial messages
        const fetchMessages = async () => {
            const userId = localStorage.getItem('user_id');
            if (!userId) return; // Wait for login or rely on empty initial state

            try {
                const res = await apiFetch(`/api/messages?profileId=${profile.id}&userId=${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) {
                        setMessages(data.map((m: any) => ({
                            id: m.id,
                            text: m.content,
                            sender: m.is_user_message ? 'user' : 'ai',
                            timestamp: new Date(m.created_at)
                        })));
                    }
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        fetchMessages();
    }, [profile.id, isLoggedIn]); // Re-fetch when logged in

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userId = localStorage.getItem('user_id');
        if (!userId) {
            // Should not happen if button disabled/input readonly, but safety check
            return;
        }

        const userMessage: Message = {
            id: Date.now(),
            text: inputText,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        // Save user message
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

        // Call AI API for response
        try {
            const res = await apiFetch('/api/chat/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profile,
                    userMessage: userMessage.text,
                    history: messages.slice(-5)
                })
            });

            if (res.ok) {
                const data = await res.json();
                const aiMessage: Message = {
                    id: Date.now() + 1,
                    text: data.reply,
                    sender: 'ai',
                    timestamp: new Date(),
                };

                setMessages((prev) => [...prev, aiMessage]);
                setIsTyping(false);

                // Save AI message
                await apiFetch('/api/messages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        profile_id: profile.id,
                        user_id: userId,
                        content: aiMessage.text,
                        is_user_message: false
                    })
                });
            } else {
                console.error('Failed to generate AI response');
                setIsTyping(false);
            }
        } catch (error) {
            console.error('Error generating response:', error);
            setIsTyping(false);
        }
    };

    return (
        <>
            <div className="flex flex-col w-full h-full md:h-[500px] md:w-[350px] bg-white md:rounded-xl shadow-2xl border border-gray-200 overflow-hidden fixed md:relative inset-0 md:inset-auto z-50 md:z-auto">
                {/* Header */}
                <div className="bg-primary p-4 flex justify-between items-center text-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">{profile.name}</h3>
                            <p className="text-xs text-teal-100 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                Online
                            </p>
                        </div>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
                            <span className="sr-only">Close</span>
                            <X className="w-6 h-6" />
                        </button>
                    )}
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={clsx(
                                'flex max-w-[85%]',
                                msg.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'
                            )}
                        >
                            <div
                                className={clsx(
                                    'p-3 rounded-2xl text-sm shadow-sm',
                                    msg.sender === 'user'
                                        ? 'bg-primary text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                )}
                            >
                                {msg.text}
                                <p className={clsx('text-[10px] mt-1 text-right', msg.sender === 'user' ? 'text-teal-100' : 'text-gray-400')}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex items-center gap-2 text-gray-400 text-xs ml-2">
                            <Bot className="w-3 h-3" />
                            <span>{profile.name} is typing...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100 shrink-0 safe-area-bottom">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onFocus={handleInputFocus}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={isLoggedIn ? "Type a message..." : "Register to chat..."}
                            className="flex-1 p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm text-gray-900 placeholder:text-gray-500"
                            readOnly={!isLoggedIn}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputText.trim() || isTyping}
                            aria-label="Send message"
                            className="bg-primary hover:bg-primary-dark disabled:bg-gray-300 text-white p-3 rounded-full transition-colors shadow-sm"
                        >
                            <Send className="w-5 h-5" />
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
