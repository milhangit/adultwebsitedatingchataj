'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

export default function ActiveMemberCounter() {
    // Base count around 1200-1500
    const [count, setCount] = useState(1423);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // Initialize with a random number between 1200 and 1800
        setCount(Math.floor(Math.random() * (1800 - 1200 + 1) + 1200));

        const interval = setInterval(() => {
            setCount(prev => {
                // Randomly add or subtract 1-5 users
                const change = Math.floor(Math.random() * 5) + 1;
                const direction = Math.random() > 0.5 ? 1 : -1;
                let newCount = prev + (change * direction);

                // Keep within reasonable bounds
                if (newCount < 1100) newCount += 15;
                if (newCount > 2500) newCount -= 15;

                return newCount;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    if (!isClient) return null;

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/20">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                <span className="text-xs font-bold text-green-700 dark:text-green-300 tabular-nums">
                    {count.toLocaleString()} Online
                </span>
            </div>
        </div>
    );
}
