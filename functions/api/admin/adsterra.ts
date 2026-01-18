const API_TOKEN = '3a2c2a04e69f8c8b5c9959b92c2ccfb8';
const BASE_URL = 'https://api.publishers.adsterra.com/v3';

export const onRequestGet: PagesFunction<Env> = async (context) => {
    try {
        const urlObj = new URL(context.request.url);
        const group_by = urlObj.searchParams.get('group_by') || 'date';

        const finishDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30); // Last 30 days

        const startStr = startDate.toISOString().split('T')[0];
        const endStr = finishDate.toISOString().split('T')[0];

        // Format: /statistics?start_date=YYYY-MM-DD&finish_date=YYYY-MM-DD&group_by=...
        const apiUrl = `${BASE_URL}/statistics?start_date=${startStr}&finish_date=${endStr}&group_by=${group_by}`;

        console.log(`Fetching Adsterra V3 stats: ${apiUrl}`);

        const res = await fetch(apiUrl, {
            headers: {
                'X-API-Key': API_TOKEN,
                'Accept': 'application/json'
            }
        });

        if (res.ok) {
            const result = await res.json() as any;
            // The API returns data in a specific format, we might need to map it if totals aren't present
            // Based on typical ad network APIs, we sum the items for totals if not provided explicitly

            const stats = result.items || [];
            const totals = stats.reduce((acc: any, curr: any) => {
                acc.impressions += Number(curr.impressions || 0);
                acc.clicks += Number(curr.clicks || 0);
                acc.revenue += Number(curr.revenue || 0);
                return acc;
            }, { impressions: 0, clicks: 0, revenue: 0 });

            totals.ctr = totals.impressions > 0 ? ((totals.clicks / totals.impressions) * 100).toFixed(2) : 0;
            totals.cpm = totals.impressions > 0 ? ((totals.revenue / totals.impressions) * 1000).toFixed(2) : 0;
            totals.revenue = totals.revenue.toFixed(2);

            return new Response(JSON.stringify({
                totals,
                items: stats,
                _is_mock: false
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const errorText = await res.text();
        console.warn(`Adsterra API failed (${res.status}): ${errorText}`);

        // Return fallback if API fails or is not yet configured on Adsterra side
        return new Response(JSON.stringify({
            totals: { impressions: 0, clicks: 0, ctr: 0, revenue: 0, cpm: 0 },
            items: [],
            error: `API returned ${res.status}: ${errorText}`,
            _is_mock: true
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
