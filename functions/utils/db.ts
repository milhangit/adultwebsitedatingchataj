export const getDB = (context: EventContext<Env, any, Record<string, unknown>>) => {
    const { request, env } = context;
    const sessionToken = request.headers.get('D1-Session');

    // If a session token exists, use it to bind to the specific replica/session
    // Otherwise, use the default DB binding
    // Note: env.DB.withSession is the API for D1 sessions
    return sessionToken ? env.DB.withSession(sessionToken) : env.DB;
};
