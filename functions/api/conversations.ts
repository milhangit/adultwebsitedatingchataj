import { getDB } from '../utils/db';

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request } = context;
    const url = new URL(request.url);
    // For this app, we assume the "User" is the one initiating chats with "Profiles".
    // The `messages` table tracks `receiver_id` which is the Profile ID.
    // We need to group by `receiver_id` to get unique conversations.
    // Since we don't have a real multi-user auth system with different user IDs interacting with the SAME profiles in a complex way yet,
    // we will assume all messages in the DB belong to the current "context" or we filter by a hypothetical user ID if we had one.
    // However, the schema has `sender_id`. If `is_user_message` is TRUE, `sender_id` is the user.
    // If `is_user_message` is FALSE, `receiver_id` is the profile (and sender is AI/System).
    // Basically, the conversation is defined by the `receiver_id` (the Profile).

    // We want to get all Profiles that have messages associated with them.

    try {
        const db = getDB(context);

        // Query to get unique profiles with their last message
        // We group by receiver_id (Profile ID)
        const query = `
            SELECT 
                p.id, 
                p.name, 
                p.imageUrl, 
                m.content as lastMessage, 
                m.created_at as lastMessageTime,
                m.is_user_message
            FROM profiles p
            JOIN (
                SELECT 
                    receiver_id, 
                    content, 
                    created_at, 
                    is_user_message,
                    ROW_NUMBER() OVER (PARTITION BY receiver_id ORDER BY created_at DESC) as rn
                FROM messages
            ) m ON p.id = m.receiver_id
            WHERE m.rn = 1
            ORDER BY m.created_at DESC
        `;

        const { results } = await db.prepare(query).all();

        return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
