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

    // Haptic Feedback wrapper
    haptic(duration = 10) {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    }
};

// Initialize UI elements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    UI.initBottomSheet();
});

// Expose for HTML inline handlers
(window as any).UI = UI;
