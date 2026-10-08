/**
 * Spiderweb Architecture - Event Bus for Mobile App (SPA)
 * Allows different views to react to data state changes instantly.
 */
export const Spiderweb = {
    _listeners: {} as Record<string, Function[]>,

    /**
     * Pluck a strand on the web.
     * @param event The event name
     * @param payload Data payload
     */
    pluck(event: string, payload: any = null) {
        console.log(`[Spiderweb] Plucked: ${event}`, payload);
        if (this._listeners[event]) {
            this._listeners[event].forEach(callback => {
                try {
                    callback(payload);
                } catch (e) {
                    console.error(`[Spiderweb] Listener Error on ${event}:`, e);
                }
            });
        }
    },

    /**
     * Listen to a strand on the web.
     */
    listen(event: string, callback: Function) {
        if (!this._listeners[event]) {
            this._listeners[event] = [];
        }
        this._listeners[event].push(callback);
    },
    
    /**
     * Remove a listener.
     */
    unlisten(event: string, callback: Function) {
        if (!this._listeners[event]) return;
        this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
    }
};

(window as any).Spiderweb = Spiderweb;
