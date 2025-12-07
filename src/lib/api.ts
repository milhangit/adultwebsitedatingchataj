export const apiFetch = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers);

    // Get session token from storage
    const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('d1_session_token') : null;
    if (sessionToken) {
        headers.set('D1-Session', sessionToken);
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    // Update session token from response
    const newSessionToken = response.headers.get('D1-Session');
    if (newSessionToken && typeof window !== 'undefined') {
        localStorage.setItem('d1_session_token', newSessionToken);
    }

    return response;
};
