'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function GlobalAds() {
    const [ads, setAds] = useState<any>(null);
    const pathname = usePathname();

    useEffect(() => {
        // Don't show ads on register page or admin panel
        if (pathname === '/register' || pathname?.startsWith('/admin')) {
            return;
        }

        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                const config = data as any;
                if (config.enable_ads === '1') {
                    setAds(config);
                }
            })
            .catch(console.error);
    }, [pathname]);

    useEffect(() => {
        if (!ads) return;

        // 1. Popunder - Should be in head but we can inject it here
        if (ads.ad_popunder_script) {
            injectScript(ads.ad_popunder_script, true);
        }

        // 2. Social Bar - Should be before body end
        if (ads.ad_social_bar_script) {
            injectScript(ads.ad_social_bar_script, false);
        }

    }, [ads]);

    const injectScript = (scriptHtml: string, inHead: boolean) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(`<div>${scriptHtml}</div>`, 'text/html');
        const scriptTags = doc.querySelectorAll('script');

        scriptTags.forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            newScript.innerHTML = oldScript.innerHTML;

            if (inHead) {
                document.head.appendChild(newScript);
            } else {
                document.body.appendChild(newScript);
            }
        });
    };

    return null;
}
