// @ts-nocheck
import { Store } from '../store/store';
import { UI } from '../components/ui';

export const Profile = {
    async init() {
        const idDisplay = document.getElementById('clinical-id-display');
        if (idDisplay && Store.pairingPin) {
            idDisplay.textContent = Store.pairingPin;
        }

        const profile = await Store.getProfile();
        if (profile) {
            const nameDisplay = document.getElementById('profile-display-name');
            const nameInput = document.getElementById('profile-input-name') as HTMLInputElement;
            
            if (nameDisplay && profile.name) nameDisplay.textContent = profile.name;
            if (nameInput && profile.name) nameInput.value = profile.name;
        }

        const weekDisplay = document.getElementById('profile-gestation-week');
        if (weekDisplay) {
            const week = await Store.getCurrentGestationalWeek();
            weekDisplay.textContent = `Week ${week}`;
        }

        const copyBtn = document.getElementById('btn-copy-clinical-id');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyClinicalId());
        }
    },

    copyClinicalId() {
        if (Store.userId) {
            navigator.clipboard.writeText(Store.userId).then(() => {
                UI.showToast('Clinical ID copied to clipboard');
            }).catch(err => {
                console.error('Could not copy ID', err);
            });
        }
    }
};
