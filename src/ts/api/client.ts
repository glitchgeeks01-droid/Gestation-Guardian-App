export const API_BASE = window.location.protocol === 'file:' ? 'http://10.0.2.2:3000/api' : '/api';
export const apiClient = {
    get: async (endpoint: string, headers: Record<string, string> = {}) => fetch(API_BASE + endpoint, {
        headers: {
            'X-GG-Sync-Token': 'gg-sync-internal-token-2026',
            ...headers
        }
    }),
    post: async (endpoint: string, body: any, headers: Record<string, string> = {}) => {
        // Defensive scrub: Ensure plaintext passwords never leak to synchronization endpoints
        if (body && typeof body === 'object' && 'password' in body) {
            delete body.password;
        }
        return fetch(API_BASE + endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-GG-Sync-Token': 'gg-sync-internal-token-2026',
                ...headers
            },
            body: JSON.stringify(body)
        });
    }
};
