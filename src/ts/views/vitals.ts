// @ts-nocheck
import { App } from './app';
import { Store } from '../store/store';
import { UI } from '../components/ui';

// js/vitals.js

/**
 * Gestation Guardian - Vitals Logging Logic
 */

export const Vitals = {
    
    // Symptom chips on Dashboard
    async logSymptom(symptom, btnElement) {
        // Find if we already have a symptom log for today
        const todayLogs = await Store.getTodaySymptoms();
        let log = todayLogs.length > 0 ? todayLogs[0] : null;
        
        if (!log) {
            log = await Store.addLog(Store.KEYS.SYMPTOMS, {
                symptoms: [symptom],
                severity: 1,
                notes: 'Quick log from dashboard'
            });
            UI.showToast(`Logged symptom: ${symptom}`);
        } else {
            // Update existing today's log
            if (!log.symptoms) log.symptoms = [];
            
            if (!log.symptoms.includes(symptom)) {
                log.symptoms.push(symptom);
                
                // We need to update the store with the modified log
                // Simplest way: find index and replace
                const allLogs = await Store.getLogs(Store.KEYS.SYMPTOMS);
                const index = allLogs.findIndex(l => l.id === log.id);
                if (index !== -1) {
                    allLogs[index] = log;
                    await Store._set(Store.KEYS.SYMPTOMS, allLogs);
                }
                
                UI.showToast(`Added symptom: ${symptom}`);
            }
        }
        
        // Visual feedback on the button
        if (btnElement) {
            btnElement.classList.replace('btn-secondary', 'btn-primary');
            btnElement.style.background = 'var(--clr-primary)';
            btnElement.style.color = 'white';
        }
        
        // Triggers RAG update on dashboard
        if (window.DashboardUI) DashboardUI.init();
    },
    
    // BP Form Submission
    async saveBP() {
        const bpSys = parseInt((document.getElementById('bp-sys') as HTMLInputElement)?.value);
        const bpDia = parseInt((document.getElementById('bp-dia') as HTMLInputElement)?.value);
        const maternalHR = parseInt((document.getElementById('bp-pulse') as HTMLInputElement)?.value) || 0;
        
        // Get radio button values
        let position = 'sitting';
        const posRadios = document.getElementsByName('bp-position');
        for (let r of posRadios) { if (r.checked) position = r.value; }
        
        let arm = 'left';
        const armRadios = document.getElementsByName('bp-arm');
        for (let r of armRadios) { if (r.checked) arm = r.value; }
        
        const notes = (document.getElementById('bp-notes') as HTMLTextAreaElement)?.value;
        
        if (!bpSys || !bpDia) {
            UI.showToast('Please enter both Systolic and Diastolic values', 'error');
            return;
        }
        
        if (bpSys < 50 || bpSys > 250 || bpDia < 30 || bpDia > 150) {
            UI.showToast('Values seem out of normal human range. Please check.', 'error');
            return;
        }

        await Store.addLog(Store.KEYS.BP_LOGS, {
            bpSys, bpDia, maternalHR, position, arm, notes,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().split(' ')[0]
        });
        
        UI.showToast('Blood Pressure reading saved successfully', 'success');
        
        // Go back to dashboard
        setTimeout(() => App.goBack(), 1000);
    },
    
    // Vitals Form Submission
    async saveVitals() {
        const weight = parseFloat((document.getElementById('vital-weight') as HTMLInputElement)?.value);
        const sleep = parseFloat((document.getElementById('vital-sleep') as HTMLInputElement)?.value);
        const stress = parseInt((document.getElementById('vital-stress') as HTMLInputElement)?.value);
        const temp = parseFloat((document.getElementById('vital-temp') as HTMLInputElement)?.value);
        const glucose = parseFloat((document.getElementById('vital-glucose') as HTMLInputElement)?.value);
        const protein = (document.getElementById('vital-protein') as HTMLSelectElement)?.value;
        
        const data = {};
        if (weight) data.weight = weight;
        if (sleep) data.sleep = sleep;
        if (stress) data.stress = stress;
        if (temp) data.temperature = temp;
        if (glucose) data.glucose = glucose;
        if (protein) data.protein = protein;
        
        if (Object.keys(data).length === 0) {
            UI.showToast('Please enter at least one vital sign', 'error');
            return;
        }
        
        await Store.addLog(Store.KEYS.VITALS_LOGS, data);
        
        UI.showToast('Vitals saved successfully', 'success');
        setTimeout(() => App.goBack(), 1000);
    },
    
    // Init functions for specific pages
    initBPPage() {
        // Pre-fill time/date if needed, set up UI
    },
    
    initVitalsPage() {
        // Setup stress slider visual feedback if needed
        const stressInput = document.getElementById('vital-stress');
        if (stressInput) {
            stressInput.addEventListener('input', (e) => {
                // Update gradient or label based on value (1-10)
            });
        }
    }
};

window.Vitals = Vitals;

// Expose for HTML inline handlers
(window as any).Vitals = Vitals;
