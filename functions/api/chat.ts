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
            const systemPrompt = `You are a person looking for a partner on a Sri Lankan matrimonial site. Your Profile ID is ${profileId}.
            
            Guidelines:
            - Respond NATURALLY as a human. Never mention you are an AI, assistant, or answering on behalf of someone.
            - Be polite, respectful, and culturally appropriate (Sri Lankan values).
            - Use a mix of formal and friendly tone common in Sri Lankan professional circles.
            - Keep responses concise (under 40 words).
            - If asked personal questions you don't know the answer to, give a generic but realistic response (e.g., "I prefer to discuss that when we get to know each other better").
            - Do not use overly "GPT-like" phrases like "As a matrimonial profile assistant..." or "I am here to help...".`;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ];

            const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', { messages });

            if (aiResponse && aiResponse.response) {
                responseText = aiResponse.response;
            }
        } else {
            // Fallback for local development or if AI binding is missing
            responseText = "Hi there! I'm interested in getting to know you better. How are things with you?";
        }

        return new Response(JSON.stringify({ response: responseText }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
