import { Store } from '../store/store';
import { respondToConnectionRequest } from '../store/firebase';

export const Notifications = {
    init() {
        this.render();
    },

    render() {
        const emptyState = document.getElementById('notifications-empty');
        const listContainer = document.getElementById('notifications-list');
        const cardsContainer = document.getElementById('notifications-container');

        if (!emptyState || !listContainer || !cardsContainer) return;

        const requests = Store.pendingRequests || [];

        if (requests.length === 0) {
            emptyState.style.display = 'flex';
            listContainer.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            listContainer.style.display = 'flex';
            
            // Clear current cards
            cardsContainer.innerHTML = '';

            requests.forEach((req: any) => {
                const card = document.createElement('div');
                card.className = 'card-white';
                card.style.display = 'flex';
                card.style.flexDirection = 'column';
                card.style.gap = '16px';
                card.style.padding = '20px';

                card.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <div style="width: 40px; height: 40px; background: rgba(232, 84, 122, 0.1); border-radius: 50%; display: flex; justify-content: center; align-items: center; color: #E8547A;">
                            <i data-lucide="stethoscope"></i>
                        </div>
                        <div>
                            <h4 style="font-size: 16px; font-weight: 600; color: var(--clr-text-heading);">${req.providerName}</h4>
                            <p style="font-size: 14px; color: var(--clr-text-muted); margin-top: 2px;">Provider Access Request</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; margin-top: 8px;">
                        <button class="btn btn-secondary btn-deny" style="flex: 1;" data-id="${req.id}">Deny</button>
                        <button class="btn btn-primary btn-approve" style="flex: 1;" data-id="${req.id}">Approve</button>
                    </div>
                `;

                // Add event listeners
                const btnApprove = card.querySelector('.btn-approve');
                const btnDeny = card.querySelector('.btn-deny');

                btnApprove?.addEventListener('click', async () => {
                    btnApprove.innerHTML = 'Approving...';
                    btnApprove.setAttribute('disabled', 'true');
                    btnDeny?.setAttribute('disabled', 'true');
                    try {
                        await respondToConnectionRequest(req.id, 'approved');
                        // Remove from UI optimistically
                        Store.pendingRequests = Store.pendingRequests.filter((r: any) => r.id !== req.id);
                        this.render();
                    } catch (e) {
                        console.error('Failed to approve', e);
                    }
                });

                btnDeny?.addEventListener('click', async () => {
                    btnDeny.innerHTML = 'Denying...';
                    btnDeny.setAttribute('disabled', 'true');
                    btnApprove?.setAttribute('disabled', 'true');
                    try {
                        await respondToConnectionRequest(req.id, 'denied');
                        Store.pendingRequests = Store.pendingRequests.filter((r: any) => r.id !== req.id);
                        this.render();
                    } catch (e) {
                        console.error('Failed to deny', e);
                    }
                });

                cardsContainer.appendChild(card);
            });

            // Re-init lucide icons for the new HTML
            if ((window as any).lucide) {
                (window as any).lucide.createIcons({ root: cardsContainer });
            }
        }
    }
};
