const API_TOKEN = '3a2c2a04e69f8c8b5c9959b92c2ccfb8';

async function testApi() {
    console.log('--- Testing Adsterra API Variations (Websites) ---');

    const variations = [
        // V3 Standard?
        `https://api3.adsterratools.com/publisher/websites.json`,
        `https://api3.adsterratools.com/publisher/websites`,

        // With token in path (V2 style)
        `https://api3.adsterratools.com/publisher/${API_TOKEN}/websites.json`,
        `https://api3.adsterratools.com/publisher/${API_TOKEN}/websites`,

        // With /v3 prefix?
        `https://api3.adsterratools.com/v3/publisher/websites.json`,
        `https://api3.adsterratools.com/v3/publisher/websites`,

        // Fallback domain
        `https://publisher.adsterratools.com/api/v1/websites`,
    ];

    const headers = { 'X-API-Key': API_TOKEN };

    for (const url of variations) {
        console.log(`\nTesting: ${url}`);
        try {
            const res = await fetch(url, { headers });
            console.log(`Status: ${res.status} ${res.statusText}`);
            if (res.ok) {
                const data = await res.json();
                console.log('SUCCESS!');
                console.log(JSON.stringify(data).substring(0, 200));
                return; // Stop on first success
            } else {
                try {
                    const text = await res.text();
                    console.log('Body:', text.substring(0, 100));
                } catch (e) { }
            }
        } catch (error: any) {
            console.error('Error:', error.message);
        }
    }
}

testApi();
