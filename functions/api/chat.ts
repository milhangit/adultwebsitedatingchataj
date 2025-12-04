interface Env {
    AI: any;
    DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const body: any = await request.json();
        const { message, profileId } = body;

        if (!message || !profileId) {
            return new Response(JSON.stringify({ error: 'Missing message or profileId' }), { status: 400 });
        }

        // In a real implementation, we would fetch the profile from D1
        // const profile = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(profileId).first();

        // For now, we'll use the AI to generate a response based on a generic prompt
        // Note: This requires the AI binding to be configured in Cloudflare Dashboard for the Pages project

        let responseText = "I'm sorry, I can't answer that right now.";

        if (env.AI) {
            const systemPrompt = `You are a Sri Lankan matrimonial profile assistant. You are polite, traditional, and value family. 
      You are responding on behalf of a profile ID ${profileId}. 
      Keep answers short (under 50 words) and culturally appropriate for a matrimonial site.`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ];

            const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', { messages });

            if (aiResponse && aiResponse.response) {
                responseText = aiResponse.response;
            }
        } else {
            // Fallback if AI binding is not set up
            responseText = "AI binding not found. Please configure Cloudflare Workers AI.";
        }

        return new Response(JSON.stringify({ response: responseText }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
