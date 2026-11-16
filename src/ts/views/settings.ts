// @ts-nocheck
import { SecureStore } from '../core/secure_store';
import { UI } from '../components/ui';

export interface AppSettings {
    language: 'en' | 'hi' | 'es';
    quietHoursEnabled: boolean;
    quietHoursStart: string;
    quietHoursEnd: string;
    biometricLockEnabled: boolean;
    autoLockTimeout: string;
}

export const SettingsView = {
    async init() {
        const settings: AppSettings = await SecureStore.getSecureItem<AppSettings>('gg_settings') || {
            language: 'en',
            quietHoursEnabled: true,
            quietHoursStart: '22:00',
            quietHoursEnd: '07:00',
            biometricLockEnabled: true,
            autoLockTimeout: '1'
        };

        const langSelect = document.getElementById('settings-language-select') as HTMLSelectElement;
        const quietToggle = document.getElementById('settings-quiet-toggle') as HTMLInputElement;
        const quietStart = document.getElementById('settings-quiet-start') as HTMLInputElement;
        const quietEnd = document.getElementById('settings-quiet-end') as HTMLInputElement;
        const bioToggle = document.getElementById('settings-biometric-toggle') as HTMLInputElement;
        const autoLockSelect = document.getElementById('settings-autolock-select') as HTMLSelectElement;
        const saveBtn = document.getElementById('btn-save-settings');

        if (langSelect) langSelect.value = settings.language || 'en';
        if (quietToggle) {
            quietToggle.checked = settings.quietHoursEnabled ?? true;
            this.updateSwitchVisual(quietToggle, 'quiet-slider', 'quiet-thumb');
            quietToggle.onchange = () => this.updateSwitchVisual(quietToggle, 'quiet-slider', 'quiet-thumb');
        }
        if (quietStart) quietStart.value = settings.quietHoursStart || '22:00';
        if (quietEnd) quietEnd.value = settings.quietHoursEnd || '07:00';
        if (bioToggle) {
            bioToggle.checked = settings.biometricLockEnabled ?? true;
            this.updateSwitchVisual(bioToggle, 'bio-slider', 'bio-thumb');
            bioToggle.onchange = () => this.updateSwitchVisual(bioToggle, 'bio-slider', 'bio-thumb');
        }
        if (autoLockSelect) autoLockSelect.value = settings.autoLockTimeout || '1';

        if (saveBtn) {
            saveBtn.onclick = () => this.saveSettings();
        }
    },

    updateSwitchVisual(toggle: HTMLInputElement, sliderId: string, thumbId: string) {
        const slider = document.getElementById(sliderId);
        const thumb = document.getElementById(thumbId);
        if (!slider || !thumb) return;

        if (toggle.checked) {
            slider.style.backgroundColor = 'var(--clr-primary)';
            thumb.style.left = '23px';
            thumb.style.right = 'auto';
        } else {
            slider.style.backgroundColor = '#ccc';
            thumb.style.left = '3px';
            thumb.style.right = 'auto';
        }
    },

    async saveSettings() {
        const langSelect = document.getElementById('settings-language-select') as HTMLSelectElement;
        const quietToggle = document.getElementById('settings-quiet-toggle') as HTMLInputElement;
        const quietStart = document.getElementById('settings-quiet-start') as HTMLInputElement;
        const quietEnd = document.getElementById('settings-quiet-end') as HTMLInputElement;
        const bioToggle = document.getElementById('settings-biometric-toggle') as HTMLInputElement;
        const autoLockSelect = document.getElementById('settings-autolock-select') as HTMLSelectElement;

        const updated: AppSettings = {
            language: (langSelect?.value as any) || 'en',
            quietHoursEnabled: quietToggle ? quietToggle.checked : true,
            quietHoursStart: quietStart?.value || '22:00',
            quietHoursEnd: quietEnd?.value || '07:00',
            biometricLockEnabled: bioToggle ? bioToggle.checked : true,
            autoLockTimeout: autoLockSelect?.value || '1'
        };

        await SecureStore.setSecureItem('gg_settings', updated);
        UI.showToast('Settings saved successfully', 'success');

        setTimeout(() => {
            if (window.App && typeof window.App.goBack === 'function') {
                window.App.goBack();
            } else {
                window.location.hash = '#/dashboard';
            }
        }, 300);
    }
};

// Global hook
if (typeof window !== 'undefined') {
    (window as any).SettingsView = SettingsView;
}
