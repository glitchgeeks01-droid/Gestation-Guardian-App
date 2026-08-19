// @ts-nocheck
// js/ui.js

/**
 * Gestation Guardian - Global UI Manager
 * Handles toasts, modals, bottom sheets, and bottom navigation
 */

export const UI = {
    // Bottom Nav state management
    updateBottomNav(currentRoute) {
        const bottomNav = document.getElementById('bottom-nav');
        if (!bottomNav) return;
        
        // Hide nav on auth and full-screen flow pages
        const hideOnRoutes = ['onboarding', 'signin', 'signup', 'bluetooth'];
        if (hideOnRoutes.includes(currentRoute)) {
            bottomNav.classList.add('hidden');
            return;
        }
        
        bottomNav.classList.remove('hidden');
        
        // Update active state
        document.querySelectorAll('.nav-item').forEach(item => {
            if (item.getAttribute('data-target') === currentRoute) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    },
    
    // Toast Notification System
    showToast(message, type = 'success', duration = 3000) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Use Lucide icons
        const iconName = type === 'success' ? 'check-circle' : 'alert-triangle';
        toast.innerHTML = `
            <i data-lucide="${iconName}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        if ((window as any).lucide) {
            (window as any).lucide.createIcons({ root: toast });
        }
        
        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300); // Wait for transition
        }, duration);
    },
    
    // Bottom Sheet Manager
    initBottomSheet() {
        const overlay = document.getElementById('log-sheet-overlay');
        const fabBtn = document.getElementById('nav-log-btn');
        const bottomSheet = document.querySelector('.bottom-sheet');
        
        if (!overlay || !fabBtn || !bottomSheet) return;
        
        // Open sheet when FAB is clicked
        fabBtn.addEventListener('click', (e) => {
            e.preventDefault();
            overlay.classList.remove('hidden');
        });
        
        // Close sheet when clicking overlay (outside the sheet)
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.add('hidden');
            }
        });
        
        // Close sheet on swipe down (simple implementation)
        let startY = 0;
        bottomSheet.addEventListener('touchstart', (e: any) => {
            startY = e.touches[0].clientY;
        }, {passive: true});
        
        bottomSheet.addEventListener('touchmove', (e: any) => {
            const y = e.touches[0].clientY;
            if (y - startY > 50) { // If swiped down 50px
                overlay.classList.add('hidden');
            }
        }, {passive: true});

        // Close sheet when a link inside it is clicked
        bottomSheet.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                overlay.classList.add('hidden');
            });
        });
    },

    // Initialize data-action listeners
    initActions() {
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const actionEl = target.closest('[data-action]') as HTMLElement;
            if (!actionEl) return;
            const action = actionEl.getAttribute('data-action');
            if (!action) return;
            // Prevent default for anchor/button
            e.preventDefault();
            switch (action) {
                case 'log-vital':
                    // Trigger FAB log button click
                    const logBtn = document.getElementById('nav-log-btn');
                    if (logBtn) logBtn.click();
                    break;
                case 'back':
                    if (window['App'] && typeof window['App'].goBack === 'function') {
                        window['App'].goBack();
                    }
                    break;
                case 'send-otp':
                    if (window['Auth'] && typeof window['Auth'].sendOTP === 'function') {
                        window['Auth'].sendOTP();
                    }
                    break;
                case 'toggle-password':
                    const pwdId = actionEl.getAttribute('data-target');
                    if (pwdId && window['Auth'] && typeof window['Auth'].togglePassword === 'function') {
                        window['Auth'].togglePassword(pwdId);
                    }
                    break;
                case 'log-entry':
                    const logBtn2 = document.getElementById('nav-log-btn');
                    if (logBtn2) logBtn2.click();
                    break;
                case 'signup-submit':
                    if (window['Auth'] && typeof window['Auth'].handleSignUp === 'function') window['Auth'].handleSignUp();
                    break;
                case 'signin-submit':
                    if (window['Auth'] && typeof window['Auth'].handleSignIn === 'function') window['Auth'].handleSignIn();
                    break;
                case 'calculate-edd':
                    if (window['Auth'] && typeof window['Auth'].calculateEDD === 'function') window['Auth'].calculateEDD();
                    break;
                case 'assessment-submit':
                    if (window['Assessment'] && typeof window['Assessment'].submit === 'function') window['Assessment'].submit();
                    break;
                case 'bt-connect':
                    const device = actionEl.getAttribute('data-device');
                    if (device && window['Bluetooth'] && typeof window['Bluetooth'].connect === 'function') window['Bluetooth'].connect(device);
                    break;
                case 'care-finish':
                case 'back-link':
                    if (window['App'] && typeof window['App'].goBack === 'function') window['App'].goBack();
                    break;
                case 'toggle-contraction':
                    if (window['Kicks'] && typeof window['Kicks'].toggleContraction === 'function') window['Kicks'].toggleContraction();
                    break;
                case 'open-ai-chat':
                    if (window['AIBot'] && typeof window['AIBot'].openChat === 'function') window['AIBot'].openChat();
                    break;
                case 'log-symptom':
                    const symptom = actionEl.getAttribute('data-symptom');
                    if (symptom && window['Vitals'] && typeof window['Vitals'].logSymptom === 'function') window['Vitals'].logSymptom(symptom, actionEl);
                    break;
                case 'log-kick':
                    if (window['Kicks'] && typeof window['Kicks'].logKick === 'function') window['Kicks'].logKick();
                    break;
                case 'toggle-kick-session':
                    if (window['Kicks'] && typeof window['Kicks'].toggleSession === 'function') window['Kicks'].toggleSession();
                    break;
                case 'save-bp':
                    if (window['Vitals'] && typeof window['Vitals'].saveBP === 'function') window['Vitals'].saveBP();
                    break;
                case 'save-vitals':
                    if (window['Vitals'] && typeof window['Vitals'].saveVitals === 'function') window['Vitals'].saveVitals();
                    break;
                case 'toast-msg':
                    const msg = actionEl.getAttribute('data-msg');
                    if (msg) UI.showToast(msg);
                    break;
                case 'nav-onboarding':
                    window.location.hash='#/onboarding';
                    break;
                case 'toggle-modal':
                    const modalId = actionEl.getAttribute('data-modal');
                    const display = actionEl.getAttribute('data-display');
                    if (modalId) {
                        const m = document.getElementById(modalId);
                        if (m) m.style.display = display || 'none';
                    }
                    break;
                case 'save-profile':
                    UI.showToast('Profile Saved');
                    if (window['App'] && typeof window['App'].goBack === 'function') window['App'].goBack();
                    break;
                case 'save-reminder':
                    document.getElementById('add-reminder-modal').style.display='none';
                    UI.showToast('Reminder saved', 'success');
                    break;
                case 'open-log-sheet':
                    const logBtn3 = document.getElementById('nav-log-btn');
                    if (logBtn3) logBtn3.click();
                    break;

                    const logEntryBtn = document.getElementById('nav-log-btn');
                    if (logEntryBtn) logEntryBtn.click();
                    break;
                default:
                    console.warn('Unhandled UI action:', action);
            }
        });
    },

// Initialize UI elements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    UI.initBottomSheet();
    UI.initActions();
});

// Expose for HTML inline handlers
(window as any).UI = UI;

