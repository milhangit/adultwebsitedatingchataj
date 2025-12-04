interface Env {
    DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    try {
        // In a real app, we'd get the user ID from the session/token.
        // For this demo, we'll accept a profileId in the body if simulating a user,
        // or just return success if we can't identify the user easily without auth.
        // However, the requirement is "Online Users".
        // Let's assume we pass a dummy user ID or just update a random user for demo purposes if no ID provided?
        // Better: The frontend 'ProfilePage' or 'ChatWindow' could send a heartbeat for that specific profile if we assume the user IS that profile (which is the case in this "persona" app).

        const { profileId } = await request.json() as { profileId: number };

        if (profileId) {
            await env.DB.prepare(
                'UPDATE profiles SET last_active = CURRENT_TIMESTAMP WHERE id = ?'
            ).bind(profileId).run();
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
