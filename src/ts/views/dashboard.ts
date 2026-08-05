// @ts-nocheck
import { Store } from '../store/store';
import { Scoring } from '../core/scoring';

export const DashboardUI = {
    async init() {
        console.log('Dashboard initialized');
        const profile = await Store.getProfile();
        if (profile) {
            document.getElementById('dash-name')!.textContent = profile.name.split(' ')[0] || 'User';
            
            // Trimester logic
            const week = await Store.getCurrentGestationalWeek();
            const trimester = await Store.getCurrentTrimester();
            
            document.getElementById('dash-week')!.textContent = `Week ${week}`;
            
            let triLabel = 'FIRST TRIMESTER';
            if (trimester === 2) triLabel = 'SECOND TRIMESTER';
            if (trimester === 3) triLabel = 'THIRD TRIMESTER';
            document.getElementById('dash-trimester-label')!.textContent = triLabel;
            
            // Progress
            const maxWeeks = 40;
            const progress = Math.min(Math.round((week / maxWeeks) * 100), 100);
            document.getElementById('dash-progress-bar')!.style.width = `${progress}%`;
            document.getElementById('dash-progress-text')!.textContent = `${progress}%`;
            
            const daysLeft = Math.max((maxWeeks * 7) - (week * 7), 0);
            document.getElementById('dash-days-left')!.textContent = `${daysLeft} days to go`;
            
            // Baby size emoji (simplified)
            const sizes = ['🫐', '🍇', '🍓', '🍋', '🍑', '🥑', '🧅', '🌽', '🍆', '🥥', '🍍', '🍉'];
            const sizeIndex = Math.floor(Math.min(week / 4, sizes.length - 1));
            document.getElementById('dash-baby-size')!.textContent = sizes[sizeIndex];
        }
        
        // Latest Vitals
        const latestBP = await Store.getLatestBP();
        if (latestBP) {
            document.getElementById('dash-vital-bp')!.innerHTML = `${latestBP.sys}<br><span style="font-size: 14px; font-weight: 500; color: var(--clr-text-muted);">/${latestBP.dia}</span>`;
        }
        
        const vitals = await Store.getLogs(Store.KEYS.VITALS_LOGS);
        if (vitals.length > 0) {
            const latest = vitals[0];
            if (latest.weight) {
                document.getElementById('dash-vital-weight')!.innerHTML = `${latest.weight}<br><span style="font-size: 14px; font-weight: 500; color: var(--clr-text-muted);">kg</span>`;
            }
            if (latest.sleep) {
                document.getElementById('dash-vital-sleep')!.innerHTML = `${latest.sleep}<br><span style="font-size: 14px; font-weight: 500; color: var(--clr-text-muted);">hrs</span>`;
            }
        }
        
        // RAG Score Update
        if (Scoring) {
            const result = await Scoring.evaluateCurrentState();
            const banner = document.getElementById('dash-risk-banner');
            const icon = document.getElementById('dash-risk-icon');
            const text = document.getElementById('dash-risk-text');
            
            if (banner && icon && text) {
                banner.style.borderLeftColor = result.color;
                banner.style.backgroundColor = `${result.color}1A`; // Add 10% opacity
                icon.style.color = result.color;
                text.style.color = result.color;
                text.textContent = `${result.band} (${result.score})`;
                
                if (result.band === 'Critical') {
                    icon.setAttribute('data-lucide', 'alert-triangle');
                    if ((window as any).lucide) {
                        (window as any).lucide.createIcons({root: banner});
                    }
                }
            }
        }
    }
};

(window as any).DashboardUI = DashboardUI;
