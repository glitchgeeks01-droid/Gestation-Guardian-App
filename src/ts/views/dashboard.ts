// @ts-nocheck
import { Store } from '../store/store';
import { Scoring } from '../core/scoring';

export const DashboardUI = {
    async init() {
        console.log('Dashboard initialized');
        const profile = await Store.getProfile();
        if (profile) {
            const elDashName = document.getElementById('dash-name'); if(elDashName) elDashName.textContent = (profile.name || '').split(' ')[0] || 'User';
            
            // Trimester logic
            const week = await Store.getCurrentGestationalWeek();
            const trimester = await Store.getCurrentTrimester();
            
            const safeWeek = typeof week === 'number' && !isNaN(week) ? week : 0;
            
            const elDashWeek = document.getElementById('dash-week'); if(elDashWeek) elDashWeek.textContent = `Week ${safeWeek}`;
            
            let triLabel = 'FIRST TRIMESTER';
            if (trimester === 2) triLabel = 'SECOND TRIMESTER';
            if (trimester === 3) triLabel = 'THIRD TRIMESTER';
            const elDashTri = document.getElementById('dash-trimester-label'); if(elDashTri) elDashTri.textContent = triLabel;
            
            // Progress
            const maxWeeks = 40;
            const progress = Math.min(Math.round((safeWeek / maxWeeks) * 100), 100);
            const elDashProg = document.getElementById('dash-progress-bar'); if(elDashProg) elDashProg.style.width = `${progress}%`;
            const elDashProgText = document.getElementById('dash-progress-text'); if(elDashProgText) elDashProgText.textContent = `${progress}%`;
            
            const daysLeft = Math.max((maxWeeks * 7) - (safeWeek * 7), 0);
            const elDashDays = document.getElementById('dash-days-left'); if(elDashDays) elDashDays.textContent = `${daysLeft} days to go`;
            
            // Baby size emoji (simplified)
            const sizes = ['🫐', '🍇', '🍓', '🍋', '🍑', '🥑', '🧅', '🌽', '🍆', '🥥', '🍍', '🍉'];
            const sizeIndex = Math.floor(Math.min(safeWeek / 4, sizes.length - 1));
            const elDashBaby = document.getElementById('dash-baby-size'); if(elDashBaby) elDashBaby.textContent = sizes[Math.max(0, sizeIndex)];
        }
        
        // Latest Vitals
        const latestBP = await Store.getLatestBP();
        if (latestBP) {
            const elDashBp = document.getElementById('dash-vital-bp'); if(elDashBp) elDashBp.innerHTML = `${latestBP.bpSys}<br><span style="font-size: 14px; font-weight: 500; color: var(--clr-text-muted);">/${latestBP.bpDia}</span>`;
        }
        
        const vitals = await Store.getLogs(Store.KEYS.VITALS_LOGS);
        if (vitals.length > 0) {
            const latest = vitals[0];
            if (latest.weight) {
                const elDashWeight = document.getElementById('dash-vital-weight'); if(elDashWeight) elDashWeight.innerHTML = `${latest.weight}<br><span style="font-size: 14px; font-weight: 500; color: var(--clr-text-muted);">kg</span>`;
            }
            if (latest.sleep) {
                const elDashSleep = document.getElementById('dash-vital-sleep'); if(elDashSleep) elDashSleep.innerHTML = `${latest.sleep}<br><span style="font-size: 14px; font-weight: 500; color: var(--clr-text-muted);">hrs</span>`;
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

