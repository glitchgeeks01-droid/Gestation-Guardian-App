// @ts-nocheck
import { Store } from '../store/store';
import { UI } from '../components/ui';

export const Profile = {
    async init() {
        // Show Doctor Pairing PIN
        const idDisplay = document.getElementById('clinical-id-display');
        const pin = Store.pairingPin || localStorage.getItem('gg_pairing_pin') || '';
        if (idDisplay && pin) {
            idDisplay.textContent = pin;
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
        // Copy the Doctor Pairing PIN (GG-XXXX) — this is what the doctor types in "Connect Patient"
        const pin = Store.pairingPin || localStorage.getItem('gg_pairing_pin') || '';
        if (pin) {
            navigator.clipboard.writeText(pin).then(() => {
                UI.showToast(`PIN copied: ${pin} — Share this with your doctor`);
            }).catch(err => {
                console.error('Could not copy PIN', err);
            });
        }
    }
};

