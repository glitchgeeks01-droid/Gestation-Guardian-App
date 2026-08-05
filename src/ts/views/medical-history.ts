// @ts-nocheck
import { Store } from '../store/store';
import { Charts } from './charts';
import { UI } from '../components/ui';
import { Scoring } from '../core/scoring';
import { DashboardUI } from './dashboard';

export const MedicalHistory = {
    async init() {
        console.log('Medical History initialized');
        const profile = await Store.getProfile();
        if (profile) {
            (document.getElementById('hist-first-preg') as HTMLInputElement).checked = profile.isFirstPregnancy || false;
            (document.getElementById('hist-multiple') as HTMLInputElement).checked = profile.multipleGestation || false;
            (document.getElementById('hist-prior-pe') as HTMLInputElement).checked = profile.priorPE || false;
            (document.getElementById('hist-chronic-htn') as HTMLInputElement).checked = profile.chronicHTN || false;
            
            // Add event listeners to save changes automatically
            ['hist-first-preg', 'hist-multiple', 'hist-prior-pe', 'hist-chronic-htn'].forEach(id => {
                document.getElementById(id)!.addEventListener('change', this.saveProfileChanges);
            });
        }
        
        await this.renderBPChart();
    },
    
    async saveProfileChanges() {
        const profile = (await Store.getProfile()) || {};
        profile.isFirstPregnancy = (document.getElementById('hist-first-preg') as HTMLInputElement).checked;
        profile.multipleGestation = (document.getElementById('hist-multiple') as HTMLInputElement).checked;
        profile.priorPE = (document.getElementById('hist-prior-pe') as HTMLInputElement).checked;
        profile.chronicHTN = (document.getElementById('hist-chronic-htn') as HTMLInputElement).checked;
        
        await Store.saveProfile(profile);
        UI.showToast('Profile updated', 'success');
        
        // Re-evaluate risk score
        if (Scoring && DashboardUI) {
            DashboardUI.init();
        }
    },
    
    async renderBPChart() {
        const logs = await Store.getLogs(Store.KEYS.BP_LOGS);
        
        const logContainer = document.getElementById('hist-bp-logs');
        if (!logContainer) return;
        logContainer.innerHTML = '';
        
        if (logs.length === 0) {
            logContainer.innerHTML = '<p style="text-align: center; color: var(--clr-text-muted); font-size: 14px;">No logs yet</p>';
            return;
        }
        
        // Render list
        logs.slice(0, 3).forEach((log: any) => {
            const div = document.createElement('div');
            div.style.cssText = "display: flex; justify-content: space-between; font-size: 14px;";
            div.innerHTML = `
                <span style="color: var(--clr-text-muted);">${log.date || ''} ${log.time || ''}</span>
                <span style="font-weight: 600;">${log.sys}/${log.dia}</span>
            `;
            logContainer.appendChild(div);
        });
        
        // Render chart (reverse logs to show chronological left-to-right)
        const chartData = logs.slice(0, 10).reverse().map((l: any) => l.sys);
        if (Charts) {
            // Ensure canvas sizing is reset before redraw if needed
            const canvas = document.getElementById('bp-history-chart');
            if (canvas && canvas.dataset.scaled) {
                canvas.dataset.scaled = '';
            }
            Charts.drawSparkline('bp-history-chart', chartData, '#6DA171', 4);
        }
    }
};

(window as any).MedicalHistory = MedicalHistory;
