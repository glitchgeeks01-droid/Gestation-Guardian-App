// @ts-nocheck
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}
// @ts-nocheck
import { Auth } from './auth';
import { Bluetooth } from '../services/bluetooth';
import { Store } from '../store/store';
import { UI } from '../components/ui';
import { Kicks } from './kicks';
import { Vitals } from './vitals';
import { Assessment } from './assessment';
import { Charts } from './charts';
import { Scoring } from '../core/scoring';
import { AIBot } from '../services/ai-bot';
import { HealthRecords } from './health-records';
import { DashboardUI } from './dashboard';
import { MedicalHistory } from './medical-history';
import { Profile } from './profile';

// Expose modules to global scope for inline HTML event handlers
window.Auth = Auth;
window.Bluetooth = Bluetooth;
window.Store = Store;
window.UI = UI;
window.Kicks = Kicks;
window.Vitals = Vitals;
window.Assessment = Assessment;
window.Charts = Charts;
window.Scoring = Scoring;
window.AIBot = AIBot;
window.HealthRecords = HealthRecords;
window.DashboardUI = DashboardUI;
window.MedicalHistory = MedicalHistory;
window.Profile = Profile;

// js/app.js

/**
 * Gestation Guardian - Single Page Application Router
 */

export const App = {
    // Current active page ID
    currentPage: null,
    
    // Page history for back navigation
    history: [],
    
    // Initialize the application
    async init() {
        console.log('App Initializing...');
        
        // Initialize Global AI Bot
        if (AIBot) AIBot.init();
        
        // Initialize Offline Sync Engine
        if (Store) {
            Store.initUserId();
            Store.initSyncEngine();
        }
        
        // Handle hash changes for routing
        window.addEventListener('hashchange', this.handleRoute.bind(this));
        
        // Hide splash screen after a short delay
        setTimeout(() => {
            const splash = document.getElementById('splash-screen');
            if (splash) {
                splash.classList.add('fade-out');
                setTimeout(() => splash.remove(), 500);
            }
        }, 1000);

        // Initial route handling
        if (!window.location.hash || window.location.hash === '#/') {
            // Determine initial route based on auth state
            // If they have a profile, go to dashboard, else onboarding
            const hasProfile = (await Store.getProfile()) !== null;
            window.location.hash = hasProfile ? '#/dashboard' : '#/onboarding';
        } else {
            this.handleRoute();
        }
    },
    
    // Router logic
    async handleRoute() {
        const hash = window.location.hash || '#/';
        const route = hash.replace('#/', '') || 'onboarding';
        
        console.log(`Routing to: ${route}`);
        
        // Auth guard (redirect to onboarding if not signed in and trying to access protected route)
        const isAuthRoute = ['onboarding', 'signin', 'signup'].includes(route);
        const hasProfile = (await Store.getProfile()) !== null;
        
        // Hide AI FAB on auth routes to prevent overlap
        const fab = document.getElementById('ai-bot-fab');
        if (fab) {
            fab.style.display = isAuthRoute ? 'none' : 'flex';
        }

        if (!hasProfile && !isAuthRoute) {
            window.location.hash = '#/onboarding';
            return;
        }

        // Fetch page template if not already in DOM
        let pageEl = document.getElementById(`page-${route}`);
        
        if (!pageEl) {
            pageEl = await this.loadPageTemplate(route);
        }
        
        // Transition to new page
        this.transitionTo(pageEl, route);
        
        // Update Bottom Nav state
        UI.updateBottomNav(route);
        
        // Trigger page-specific initialization
        await this.initPage(route);
    },
    
    async loadPageTemplate(route: string) {
        try {
            // Use Vite's glob import to bundle HTML as raw strings
            const templates = (import.meta as any).glob('../../pages/*.html', { eager: true, query: '?raw', import: 'default' });
            
            // Flexible lookup to support any path format returned by Vite glob
            let html: string | null = null;
            for (const key in templates) {
                if (key.endsWith(`/${route}.html`)) {
                    html = templates[key] as string;
                    break;
                }
            }
            
            if (!html) throw new Error(`Page template not found for route: ${route}`);
            
            const temp = document.createElement('div');
            temp.innerHTML = html.trim();
            
            // Extract the actual page element from the template
            // It assumes the template provides its own <div id="page-xxx" class="page">
            let pageEl = temp.firstElementChild;
            
            // Fallback just in case template doesn't have a single root
            if (!pageEl || !pageEl.classList.contains('page')) {
                pageEl = document.createElement('div');
                pageEl.id = `page-${route}`;
                pageEl.className = 'page';
                pageEl.innerHTML = html;
            }
            
            document.getElementById('app-root').appendChild(pageEl);
            
            // Re-initialize Lucide icons for new content
            if ((window as any).lucide) {
                (window as any).lucide.createIcons({ root: pageEl });
            }
            
            return pageEl;
        } catch (error) {
            console.error(`Error loading page ${route}:`, error);
            // Fallback UI or redirect
            return null;
        }
    },
    
    transitionTo(newPageEl, route) {
        if (!newPageEl) return;
        
        // Helper to get body class
        const getBodyClass = (r) => {
            const map = {
                'dashboard': 'dashboard-body',
                'health-hub': 'hub-body',
                'care-guide': 'guide-body',
                'kick-counter': 'kick-body',
                'log-bp': 'log-bp-body',
                'log-vitals': 'log-vitals-body',
                'medical-history': 'history-body',
                'profile': 'profile-body',
                'assessment-report': 'report-body',
                'signin': 'signin-body',
                'signup': 'signup-body',
                'reminders': 'reminders-body',
                'bluetooth': 'bluetooth-body',
                'onboarding': 'onboarding-body'
            };
            if (r && r.includes('-risk-score')) {
                return r.replace('-risk-score', '-body');
            }
            return map[r] || `${r}-body`;
        };

        // Manage history and body classes
        if (this.currentPage && this.currentPage !== route) {
            const oldPageEl = document.getElementById(`page-${this.currentPage}`);
            if (oldPageEl) {
                oldPageEl.classList.remove('active');
            }
            this.history.push(this.currentPage);
            document.body.classList.remove(getBodyClass(this.currentPage));
        }
        
        newPageEl.classList.add('active');
        this.currentPage = route;
        document.body.classList.add(getBodyClass(route));
        
        // Scroll to top
        window.scrollTo(0, 0);
        newPageEl.scrollTop = 0;
    },
    
    goBack() {
        if (this.history.length > 0) {
            const prev = this.history.pop();
            // Don't push to history array on back navigation
            window.history.back(); // Use browser history to change hash
        } else {
            window.location.hash = '#/dashboard';
        }
    },
    
    // Page-specific initializers
    async initPage(route) {
        switch (route) {
            case 'onboarding':
                break;
            case 'signin':
            case 'signup':
                if (Auth) Auth.init(route);
                break;
            case 'bluetooth':
                if (Bluetooth) Bluetooth.init();
                break;
            case 'contractions':
                if (Kicks) await Kicks.initContractions();
                break;
            case 'dashboard':
                if (DashboardUI) await DashboardUI.init();
                if (Scoring) (window as any).Scoring = Scoring;
                break;
            case 'health-hub':
                if (HealthRecords) await HealthRecords.init();
                break;
            case 'kick-counter':
                if (Kicks) Kicks.init();
                break;
            case 'log-vitals':
                if (Vitals) Vitals.initVitalsPage();
                break;
            case 'log-bp':
                if (Vitals) Vitals.initBPPage();
                break;
            case 'medical-history':
                if (MedicalHistory) await MedicalHistory.init();
                break;
            case 'profile':
                if (Profile) await Profile.init();
                break;
            case 'reminders':
                // Reminders is entirely statically driven via UI methods
                break;
            case 'risk-assessment':
                if (Assessment) Assessment.init();
                break;
        }
        
        // Expose UI and Store so they aren't tree shaken if they are used globally by HTML onclicks
        (window as any).UI = UI;
        (window as any).Store = Store;
        
        // Bottom Nav toggle
        const bottomNav = document.getElementById('bottom-nav');
        if (bottomNav) {
            const mainRoutes = ['dashboard', 'health-hub', 'care-guide', 'profile'];
            if (mainRoutes.includes(route)) {
                bottomNav.classList.remove('hidden');
                // Update active state
                document.querySelectorAll('.nav-item').forEach(item => {
                    if (item.getAttribute('data-target') === route) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            } else {
                bottomNav.classList.add('hidden');
            }
        }
    }
};

// Boot the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        App.init();
    });
} else {
    App.init();
}

// Expose for HTML inline handlers
(window as any).App = App;
window.App = App;
