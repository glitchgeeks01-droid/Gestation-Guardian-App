
export const API_BASE = window.location.protocol === 'file:' ? 'http://10.0.2.2:3000/api' : '/api';
export const apiClient = {
    get: async (endpoint: string) => fetch(API_BASE + endpoint),
    post: async (endpoint: string, body: any) => fetch(API_BASE + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
};
