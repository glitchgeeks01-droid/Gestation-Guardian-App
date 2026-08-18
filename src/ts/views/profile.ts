// @ts-nocheck
import { Store } from '../store/store';
import { UI } from '../components/ui';

export const Profile = {
    async init() {
        const idDisplay = document.getElementById('clinical-id-display');
        if (idDisplay && Store.userId) {
            idDisplay.textContent = Store.userId;
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
