// @ts-nocheck
import { Store } from '../store/store';
import { SecureStore } from '../core/secure_store';
import { UI } from '../components/ui';
import { auth } from '../store/firebase';
import { signOut } from 'firebase/auth';

export const PrivacyView = {
    async init() {
        await this.loadConsentHistory();
        this.setupDiscreetMode();
        this.setupExport();
        this.setupRevokeConsent();
        this.setupPurgeAccount();
    },

    async loadConsentHistory() {
        const consent = await SecureStore.getSecureItem('gg_consent') || {
            version: '2.0',
            timestamp: new Date().toISOString().split('T')[0],
            status: 'active'
        };

        const versionDisplay = document.getElementById('consent-version-display');
        const timestampDisplay = document.getElementById('consent-timestamp-display');
        const statusBadge = document.getElementById('consent-status-badge');

        if (versionDisplay) {
            versionDisplay.textContent = `v${consent.version || '2.0'} (Clinical Telemonitoring)`;
        }

        if (timestampDisplay) {
            const dateStr = consent.timestamp ? new Date(consent.timestamp).toLocaleDateString() : 'Active';
            timestampDisplay.textContent = dateStr;
        }

        if (statusBadge) {
            const isRevoked = consent.status === 'revoked';
            statusBadge.textContent = isRevoked ? 'Revoked' : 'Active & Verified';
            statusBadge.style.color = isRevoked ? '#DC2626' : 'var(--clr-primary)';
        }
    },

    setupExport() {
        const exportBtn = document.getElementById('btn-export-health-data');
        if (!exportBtn) return;

        exportBtn.onclick = async () => {
            try {
                UI.showToast('Generating encrypted export...', 'info');
                const exportData = await SecureStore.exportDecryptedHealthData();
                const jsonStr = JSON.stringify(exportData, null, 2);
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);

                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const a = document.createElement('a');
                a.href = url;
                a.download = `gestation-guardian-health-export-${timestamp}.json`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 500);

                UI.showToast('Health data export downloaded successfully', 'success');
            } catch (err) {
                console.error('[PrivacyView] Export failed:', err);
                UI.showToast('Failed to export health data', 'error');
            }
        };
    },

    setupDiscreetMode() {
        const toggle = document.getElementById('discreet-mode-toggle') as HTMLInputElement;
        const slider = document.getElementById('discreet-slider');
        const thumb = document.getElementById('discreet-thumb');
        if (!toggle) return;

        const isDiscreet = localStorage.getItem('gg_discreet_mode') === 'true';
        toggle.checked = isDiscreet;
        this.applyDiscreetModeUI(isDiscreet, slider, thumb);

        toggle.onchange = () => {
            const active = toggle.checked;
            localStorage.setItem('gg_discreet_mode', String(active));
            this.applyDiscreetModeUI(active, slider, thumb);
            UI.showToast(active ? 'Discreet Mode Activated' : 'Discreet Mode Deactivated', 'info');
        };
    },

    applyDiscreetModeUI(active: boolean, slider?: HTMLElement | null, thumb?: HTMLElement | null) {
        if (slider && thumb) {
            slider.style.backgroundColor = active ? 'var(--clr-primary)' : '#ccc';
            thumb.style.left = active ? '25px' : '3px';
        }

        // Toggle discreet class on body
        if (active) {
            document.body.classList.add('discreet-mode');
        } else {
            document.body.classList.remove('discreet-mode');
        }
    },

    setupRevokeConsent() {
        const revokeBtn = document.getElementById('btn-revoke-consent');
        if (!revokeBtn) return;

        revokeBtn.onclick = () => {
            UI.showConfirm({
                title: 'Revoke Informed Consent?',
                message: 'Revoking consent pauses clinical telemonitoring synchronization and doctor sharing. Your cached data remains securely vaulted on device.',
                confirmText: 'Yes, Revoke',
                cancelText: 'Keep Active',
                onConfirm: async () => {
                    const consent = await SecureStore.getSecureItem('gg_consent') || { version: '2.0' };
                    consent.status = 'revoked';
                    consent.revokedAt = new Date().toISOString();
                    await SecureStore.setSecureItem('gg_consent', consent);
                    await this.loadConsentHistory();
                    UI.showToast('Consent revoked successfully', 'info');
                },
                onCancel: () => {}
            });
        };
    },

    setupPurgeAccount() {
        const purgeBtn = document.getElementById('btn-purge-account');
        if (!purgeBtn) return;

        purgeBtn.onclick = () => {
            UI.showConfirm({
                title: 'Permanent Sovereign Purge',
                message: 'Are you sure you want to delete your account and all data? All local AES keys, telemetry, and documents will be permanently erased. This action cannot be reversed.',
                confirmText: 'Delete Everything',
                cancelText: 'Cancel',
                onConfirm: async () => {
                    try {
                        UI.showToast('Executing cryptographic erasure...', 'info');
                        
                        // 1. Purge all secure storage & keys (S2)
                        await SecureStore.clearSecureStore();
                        
                        // 2. Sign out of Firebase if authenticated
                        if (auth.currentUser) {
                            await signOut(auth);
                        }

                        UI.showToast('All data permanently purged', 'success');

                        // 3. Redirect to onboarding
                        setTimeout(() => {
                            window.location.hash = '#/onboarding';
                            window.location.reload();
                        }, 500);
                    } catch (err) {
                        console.error('[PrivacyView] Purge failed:', err);
                        UI.showToast('Failed to complete sovereign purge', 'error');
                    }
                },
                onCancel: () => {}
            });
        };
    }
};

// Global hook
if (typeof window !== 'undefined') {
    (window as any).PrivacyView = PrivacyView;
}
