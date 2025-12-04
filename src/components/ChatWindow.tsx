'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Minimize2 } from 'lucide-react';
import clsx from 'clsx';
import { Profile } from '@/lib/types';

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
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMessage: Message = {
            id: Date.now(),
            text: inputText,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        // Simulate AI delay and response with persona
        setTimeout(() => {
            const lowerInput = inputText.toLowerCase();
            let responseText = '';

            // Simple keyword matching for persona simulation
            if (lowerInput.includes('family') || lowerInput.includes('parents')) {
                responseText = profile.family || `Family is very important to me. I come from a respectable family in ${profile.location}.`;
            } else if (lowerInput.includes('work') || lowerInput.includes('job') || lowerInput.includes('occupation')) {
                responseText = `I work as a ${profile.occupation}. It keeps me busy but I enjoy it!`;
            } else if (lowerInput.includes('hobby') || lowerInput.includes('interest') || lowerInput.includes('free time')) {
                responseText = profile.bio ? `As I mentioned in my bio: ${profile.bio}` : `I enjoy spending time with family and visiting temples.`;
            } else if (lowerInput.includes('religion') || lowerInput.includes('caste')) {
                responseText = `I am ${profile.religion} and my caste is ${profile.caste}.`;
            } else if (lowerInput.includes('partner') || lowerInput.includes('looking for')) {
                responseText = profile.preferences || `I'm looking for a kind and educated partner.`;
            } else {
                const genericResponses = [
                    `That's interesting! Tell me more.`,
                    `I see. Family values are really important to me, what about you?`,
                    `I'm looking for someone who is kind and understanding.`,
                    `Do you live in ${profile.location} as well?`,
                ];
                responseText = genericResponses[Math.floor(Math.random() * genericResponses.length)];
            }

            const aiMessage: Message = {
                id: Date.now() + 1,
                text: responseText,
                sender: 'ai',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1500);
    };

    return (
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
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                        className="flex-1 p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm text-gray-900 placeholder:text-gray-500"
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
    );
}
