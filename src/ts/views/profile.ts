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
            const emailDisplay = document.getElementById('profile-display-email');
            const nameInput = document.getElementById('profile-input-name') as HTMLInputElement;
            const emailInput = document.getElementById('profile-input-email') as HTMLInputElement;
            const phoneInput = document.getElementById('profile-input-phone') as HTMLInputElement;
            const ageInput = document.getElementById('profile-input-age') as HTMLInputElement;
            const dobInput = document.getElementById('profile-input-dob') as HTMLInputElement;
            const bloodSelect = document.getElementById('profile-input-blood') as HTMLSelectElement;
            const eddDisplay = document.getElementById('profile-edd-display');
            
            if (nameDisplay && profile.name) nameDisplay.textContent = profile.name;
            if (emailDisplay && profile.email) emailDisplay.textContent = profile.email;
            if (nameInput && profile.name) {
                nameInput.value = profile.name;
                nameInput.setAttribute('value', profile.name);
            }
            if (emailInput && profile.email) {
                emailInput.value = profile.email;
                emailInput.setAttribute('value', profile.email);
            }
            if (phoneInput && profile.phone) {
                phoneInput.value = profile.phone;
                phoneInput.setAttribute('value', profile.phone);
            }
            if (ageInput && profile.age !== undefined) {
                ageInput.value = String(profile.age);
                ageInput.setAttribute('value', String(profile.age));
            }
            if (dobInput && profile.dob) {
                dobInput.value = profile.dob;
                dobInput.setAttribute('value', profile.dob);
            }
            if (bloodSelect && profile.bloodGroup) {
                bloodSelect.value = profile.bloodGroup;
                Array.from(bloodSelect.options).forEach(opt => {
                    opt.selected = opt.value === profile.bloodGroup;
                });
            }
            if (eddDisplay && profile.edd) eddDisplay.textContent = `Due Date: ${profile.edd}`;
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

    async save() {
        const profile = (await Store.getProfile()) || {};
        const nameInput = document.getElementById('profile-input-name') as HTMLInputElement;
        const emailInput = document.getElementById('profile-input-email') as HTMLInputElement;
        const phoneInput = document.getElementById('profile-input-phone') as HTMLInputElement;
        const ageInput = document.getElementById('profile-input-age') as HTMLInputElement;
        const dobInput = document.getElementById('profile-input-dob') as HTMLInputElement;
        const bloodSelect = document.getElementById('profile-input-blood') as HTMLSelectElement;

        if (nameInput && nameInput.value) profile.name = nameInput.value.trim();
        if (emailInput && emailInput.value) profile.email = emailInput.value.trim().toLowerCase();
        if (phoneInput && phoneInput.value) profile.phone = phoneInput.value.trim();
        if (ageInput && ageInput.value) profile.age = parseInt(ageInput.value, 10);
        if (dobInput && dobInput.value) profile.dob = dobInput.value;
        if (bloodSelect && bloodSelect.value) profile.bloodGroup = bloodSelect.value;

        await Store.saveProfile(profile);

        const nameDisplay = document.getElementById('profile-display-name');
        if (nameDisplay && profile.name) nameDisplay.textContent = profile.name;

        UI.showToast('Profile Saved', 'success');
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

