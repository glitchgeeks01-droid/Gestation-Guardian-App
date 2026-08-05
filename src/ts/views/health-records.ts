// @ts-nocheck
import { Store } from '../store/store';

export const HealthRecords = {
    async init() {
        await this.renderTimeline();
    },
    
    formatTime(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    
    formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    },

    async renderTimeline() {
        const timelineEl = document.getElementById('health-records-timeline');
        const emptyEl = document.getElementById('health-records-empty');
        if (!timelineEl || !emptyEl) return;
        
        // Gather all logs from Store
        let allLogs: any[] = [];
        
        const addLogs = async (key: string, type: string) => {
            const logs = (await Store.getLogs(key)) || [];
            logs.forEach((log: any) => {
                allLogs.push({ ...log, _type: type });
            });
        };
        
        await addLogs(Store.KEYS.BP_LOGS, 'bp');
        await addLogs(Store.KEYS.VITALS_LOGS, 'vitals');
        await addLogs(Store.KEYS.KICKS, 'kicks');
        await addLogs(Store.KEYS.CONTRACTIONS, 'contractions');
        await addLogs(Store.KEYS.SYMPTOMS, 'symptoms');
        
        if (allLogs.length === 0) {
            emptyEl.style.display = 'block';
            return;
        } else {
            emptyEl.style.display = 'none';
        }
        
        // Sort by timestamp descending
        allLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        // Group by date
        const groupedLogs: { [key: string]: any[] } = {};
        allLogs.forEach(log => {
            const dateKey = this.formatDate(log.timestamp);
            if (!groupedLogs[dateKey]) groupedLogs[dateKey] = [];
            groupedLogs[dateKey].push(log);
        });
        
        // Render HTML
        let html = '';
        
        for (const [date, logs] of Object.entries(groupedLogs)) {
            html += `<div style="margin-top: 8px;"><h3 style="font-size: 14px; color: var(--clr-text-muted); font-weight: 600; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">${date}</h3>`;
            
            logs.forEach(log => {
                const time = this.formatTime(log.timestamp);
                let icon = 'activity';
                let iconColor = 'var(--clr-primary)';
                let title = 'Health Log';
                let details = '';
                
                if (log._type === 'bp') {
                    icon = 'heart-pulse';
                    title = 'Blood Pressure';
                    details = `<span style="font-size: 18px; font-weight: 700;">${log.sys}/${log.dia}</span> <span style="font-size: 12px; color: var(--clr-text-muted);">mmHg</span>`;
                    if (log.pulse) details += ` &middot; ${log.pulse} bpm`;
                } else if (log._type === 'vitals') {
                    if (log.weight) {
                        icon = 'scale';
                        iconColor = '#E8547A';
                        title = 'Weight';
                        details = `<span style="font-size: 18px; font-weight: 700;">${log.weight}</span> <span style="font-size: 12px; color: var(--clr-text-muted);">kg</span>`;
                    } else if (log.sleep) {
                        icon = 'moon';
                        iconColor = 'var(--clr-purple)';
                        title = 'Sleep';
                        details = `<span style="font-size: 18px; font-weight: 700;">${log.sleep}</span> <span style="font-size: 12px; color: var(--clr-text-muted);">hours</span>`;
                    }
                } else if (log._type === 'kicks') {
                    icon = 'baby';
                    iconColor = 'var(--clr-purple)';
                    title = 'Kick Session';
                    details = `<span style="font-size: 18px; font-weight: 700;">${log.count}</span> <span style="font-size: 12px; color: var(--clr-text-muted);">kicks in ${Math.round(log.duration / 60)} min</span>`;
                } else if (log._type === 'symptoms') {
                    icon = 'alert-circle';
                    iconColor = 'var(--clr-danger)';
                    title = 'Symptom Logged';
                    details = `<span style="font-size: 16px; font-weight: 600; text-transform: capitalize;">${log.symptom}</span>`;
                } else if (log._type === 'contractions') {
                    icon = 'timer';
                    iconColor = 'var(--clr-info-brown)';
                    title = 'Contraction';
                    details = `Duration: ${Math.round(log.duration)}s &middot; Intensity: ${log.intensity || 'N/A'}`;
                }
                
                html += `
                    <div class="card-white" style="display: flex; align-items: center; gap: 16px; margin-bottom: 12px; padding: 16px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: ${iconColor}1A; color: ${iconColor}; display: flex; justify-content: center; align-items: center; flex-shrink: 0;">
                            <i data-lucide="${icon}" style="width: 20px; height: 20px;"></i>
                        </div>
                        <div style="flex: 1;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <h4 style="font-weight: 600; font-size: 14px; color: var(--clr-text-heading);">${title}</h4>
                                <span style="font-size: 12px; color: var(--clr-text-muted);">${time}</span>
                            </div>
                            <div style="color: var(--clr-text-body);">${details}</div>
                            ${log.notes ? `<div style="font-size: 12px; color: var(--clr-text-muted); margin-top: 4px; background: rgba(0,0,0,0.03); padding: 8px; border-radius: 8px; font-style: italic;">"${log.notes}"</div>` : ''}
                        </div>
                    </div>
                `;
            });
            
            html += `</div>`;
        }
        
        // Re-render empty element safely
        timelineEl.innerHTML = '';
        timelineEl.appendChild(emptyEl);
        timelineEl.insertAdjacentHTML('beforeend', html);
        
        if ((window as any).lucide) {
            (window as any).lucide.createIcons({root: timelineEl});
        }
    }
};

(window as any).HealthRecords = HealthRecords;
