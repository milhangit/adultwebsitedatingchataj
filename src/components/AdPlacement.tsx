'use client';

import { useEffect, useRef } from 'react';

interface AdPlacementProps {
    scriptHtml: string;
    className?: string;
}

export default function AdPlacement({ scriptHtml, className = "" }: AdPlacementProps) {
    const adRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!adRef.current || !scriptHtml) return;

        // Clear previous ad if any
        adRef.current.innerHTML = '';

        // Extract script source and inline content
        const parser = new DOMParser();
        const doc = parser.parseFromString(`<div>${scriptHtml}</div>`, 'text/html');
        const scripts = doc.querySelectorAll('script');

        scripts.forEach(originalScript => {
            const newScript = document.createElement('script');

            // Copy attributes
            Array.from(originalScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });

            // Copy content
            if (originalScript.innerHTML) {
                newScript.innerHTML = originalScript.innerHTML;
            }

            // Append to our container
            adRef.current?.appendChild(newScript);
        });

        // Add non-script elements (like placeholders)
        doc.querySelectorAll('div, ins, a').forEach(el => {
            adRef.current?.appendChild(el.cloneNode(true));
        });

    }, [scriptHtml]);

    if (!scriptHtml) return null;

    return (
        <div
            ref={adRef}
            className={`ad-container overflow-hidden min-h-[50px] flex justify-center items-center py-4 ${className}`}
        />
    );
}
