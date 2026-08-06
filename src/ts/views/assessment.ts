// @ts-nocheck
import { Scoring } from '../core/scoring';
import { Store } from '../store/store';
import { UI } from '../components/ui';
import { Vitals } from './vitals';

// js/assessment.js

export const Assessment = {
    init() {
        console.log('Assessment initialized');
    },
    async submit() {
        // Collect form data
        const age = parseInt(document.getElementById('')?.value) || 25;
        const firstPreg = document.querySelector('input[name="q-first-preg"]:checked')?.value === 'yes';
        const priorPE = document.querySelector('input[name="q-prior-pe"]:checked')?.value === 'yes';
        const chronicHTN = document.querySelector('input[name="q-chronic-htn"]:checked')?.value === 'yes';
        const diabetes = document.getElementById('')?.value || 'none';
        const family = document.querySelector('input[name="q-family"]:checked')?.value === 'yes';
        
        const height = parseInt(document.getElementById('')?.value) || 160;
        const weight = parseInt(document.getElementById('')?.value) || 65;
        
        const bookSys = parseInt(document.getElementById('')?.value) || null;
        const bookDia = parseInt(document.getElementById('')?.value) || null;
        
        const curSys = parseInt(document.getElementById('')?.value) || null;
        const curDia = parseInt(document.getElementById('')?.value) || null;
        
        const symptomsNodes = document.querySelectorAll('input[name="q-symptoms"]:checked');
        const symptoms = Array.from(symptomsNodes).map(node => node.value);
        
        const weightGain = document.querySelector('input[name="q-weight-gain"]:checked')?.value === 'yes';
        const protein = document.getElementById('')?.value || 'unknown';

        // 1. Update Profile (Static Factors)
        const profile = (await Store.getProfile()) || {};
        profile.age = age;
        profile.isFirstPregnancy = firstPreg;
        profile.priorPE = priorPE;
        profile.chronicHTN = chronicHTN;
        profile.diabetes = diabetes;
        profile.familyHistory = family;
        profile.height = height;
        profile.prePregnancyWeight = weight;
        // Optionally save booking BP to profile if needed later
        profile.bookingBPSys = bookSys;
        profile.bookingBPDia = bookDia;
        
        await Store.saveProfile(profile);

        // 2. Update BP Logs with Current BP
        if (curSys && curDia) {
            const bpLogs = await Store.getLogs(Store.KEYS.BP_LOGS);
            bpLogs.push({
                sys: curSys,
                dia: curDia,
                position: 'sitting',
                timestamp: new Date().toISOString(),
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            });
            await Store._set(Store.KEYS.BP_LOGS, bpLogs);
        }

        // 3. Update Vitals Logs with Symptoms
        if (symptoms.length > 0) {
            const vitalsLogs = await Store.getLogs(Store.KEYS.VITALS_LOGS);
            vitalsLogs.push({
                symptoms: symptoms,
                timestamp: new Date().toISOString()
            });
            await Store._set(Store.KEYS.VITALS_LOGS, vitalsLogs);
        }

        // 4. Update Urine Logs for Proteinuria
        if (protein !== 'unknown') {
            const urineLogs = (await Store.getLogs('gg_urine_logs')) || [];
            urineLogs.push({
                protein: protein,
                timestamp: new Date().toISOString()
            });
            await Store._set('gg_urine_logs', urineLogs);
        }

        // 5. Weight Gain (Hack for immediate scoring)
        // If they report rapid weight gain, we can simulate two weight entries to trigger the scoring logic
        if (weightGain) {
            const vitalsLogs = await Store.getLogs(Store.KEYS.VITALS_LOGS);
            const now = new Date();
            const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            
            // Add a reading from a week ago, and one from today with +2.5kg
            vitalsLogs.push({
                weight: weight,
                timestamp: lastWeek.toISOString()
            });
            vitalsLogs.push({
                weight: weight + 2.5,
                timestamp: now.toISOString()
            });
            await Store._set(Store.KEYS.VITALS_LOGS, vitalsLogs);
        }

        // Everything is saved. The Dashboard will call Scoring.evaluateCurrentState() upon load.
        UI.showToast("Health profile saved. Analyzing risk...", "success");
        
        setTimeout(() => {
            window.location.hash = '#/bluetooth';
        }, 1000);
    }
};

// Expose for HTML inline handlers
(window as any).Assessment = Assessment;
