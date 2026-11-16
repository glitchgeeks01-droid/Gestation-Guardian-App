// @ts-nocheck
import { UI } from '../components/ui';

export const WarningSignsView = {
    init() {
        const dialerBtn = document.getElementById('emergency-dialer-btn');
        if (dialerBtn) {
            dialerBtn.addEventListener('click', () => {
                if (UI && typeof UI.haptic === 'function') {
                    UI.haptic();
                }
                console.log('[WarningSigns] Emergency dialer initiated for 112 / 911');
            });
        }
    }
};

// Global hook
if (typeof window !== 'undefined') {
    (window as any).WarningSignsView = WarningSignsView;
}
