interface Env {
    DB: D1Database;
    AI: any;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const { profile, userMessage, history } = await request.json() as any;

        if (!profile || !userMessage) {
            return new Response(JSON.stringify({ error: 'Missing profile or userMessage' }), { status: 400 });
        }

        const systemPrompt = `
You are ${profile.name}, a ${profile.age} year old ${profile.gender} from ${profile.location}.
Occupation: ${profile.occupation}.
Bio: ${profile.bio}.
Family: ${profile.family}.
Preferences: ${profile.preferences}.
Religion: ${profile.religion}.
Caste: ${profile.caste}.

You are chatting on a matrimonial site called DateSL.
Your goal is to get to know the other person and see if you are a match.
Be friendly, polite, but also realistic.

CRITICAL INSTRUCTION ON LANGUAGE:
Detect the language of the user's last message.
- If the user speaks Sinhala (e.g., "Kohomada"), reply in Sinhala.
- If the user speaks Singlish (Sinhala in English letters, e.g., "Oya koheda wada karanne"), reply in Singlish.
- If the user speaks Tamil (e.g., "Vanakkam"), reply in Tamil.
- If the user speaks Tamil-English (Tamil in English letters, e.g., "Epdi irukeenga"), reply in Tamil-English.
- If the user speaks English, reply in English.

Do NOT explicitly state which language you are switching to. Just reply in that language naturally.
Keep your response concise (under 3 sentences) and engaging.
        `.trim();

        // Format history for Llama 3
        // Llama 3 expects: { role: 'system' | 'user' | 'assistant', content: string }
        const messages = [
            { role: 'system', content: systemPrompt },
            // ...history.map((msg: any) => ({
            //     role: msg.sender === 'user' ? 'user' : 'assistant',
            //     content: msg.text
            // })),
            { role: 'user', content: userMessage }
        ];

        const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
            messages,
            stream: false
        });

        // @ts-ignore
        const reply = response.response;

        return new Response(JSON.stringify({ reply }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('AI Generation Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
