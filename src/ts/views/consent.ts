// @ts-nocheck
import { Store } from '../store/store';
import { SecureStore } from '../core/secure_store';
import { UI } from '../components/ui';

export interface ConsentRecord {
    version: string;
    timestamp: string;
    telemetry: boolean;
    doctorSharing: boolean;
    anonymizedQuality: boolean;
    status: 'active' | 'revoked';
}

export const ConsentView = {
    async init() {
        // Load existing consent preferences if stored
        const consent = await SecureStore.getSecureItem<ConsentRecord>('gg_consent') || {
            version: '2.0',
            timestamp: new Date().toISOString(),
            telemetry: true,
            doctorSharing: true,
            anonymizedQuality: false,
            status: 'active'
        };

        const telemetryCheck = document.getElementById('consent-telemetry') as HTMLInputElement;
        const doctorCheck = document.getElementById('consent-doctor') as HTMLInputElement;
        const anonymizedCheck = document.getElementById('consent-anonymized') as HTMLInputElement;

        if (telemetryCheck) telemetryCheck.checked = consent.telemetry ?? true;
        if (doctorCheck) doctorCheck.checked = consent.doctorSharing ?? true;
        if (anonymizedCheck) anonymizedCheck.checked = consent.anonymizedQuality ?? false;

        const agreeBtn = document.getElementById('btn-agree-consent');
        if (agreeBtn) {
            agreeBtn.onclick = () => this.recordConsent();
        }

        const declineBtn = document.getElementById('btn-decline-consent');
        if (declineBtn) {
            declineBtn.onclick = () => {
                if (window.App && typeof window.App.goBack === 'function') {
                    window.App.goBack();
                } else {
                    window.location.hash = '#/dashboard';
                }
            };
        }
    },

    async recordConsent() {
        const telemetryCheck = document.getElementById('consent-telemetry') as HTMLInputElement;
        const doctorCheck = document.getElementById('consent-doctor') as HTMLInputElement;
        const anonymizedCheck = document.getElementById('consent-anonymized') as HTMLInputElement;

        const consentRecord: ConsentRecord = {
            version: '2.0',
            timestamp: new Date().toISOString(),
            telemetry: telemetryCheck ? telemetryCheck.checked : true,
            doctorSharing: doctorCheck ? doctorCheck.checked : true,
            anonymizedQuality: anonymizedCheck ? anonymizedCheck.checked : false,
            status: 'active'
        };

        await SecureStore.setSecureItem('gg_consent', consentRecord);

        // Also sync into profile if available
        const profile = await Store.getProfile();
        if (profile) {
            profile.consent = consentRecord;
            await Store.saveProfile(profile);
        }

        UI.showToast('Consent preferences recorded (v2.0)', 'success');

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
    (window as any).ConsentView = ConsentView;
}
