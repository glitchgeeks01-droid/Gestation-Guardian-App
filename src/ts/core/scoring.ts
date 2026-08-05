// @ts-nocheck
import { Store } from '../store/store';
import { UI } from '../components/ui';
import { Vitals } from '../views/vitals';

// js/scoring.js

/**
 * Gestation Guardian - GESTOSIS Scoring & RAG Alert Engine
 */

export const Scoring = {
    // Helper to calculate BMI
    calcBMI(weightKg, heightCm) {
        if (!weightKg || !heightCm) return 0;
        const heightM = heightCm / 100;
        return weightKg / (heightM * heightM);
    },

    async evaluateCurrentState() {
        const profile = await Store.getProfile();
        if (!profile) return { score: 0, band: 'Low', color: '#436746', action: 'Complete profile' };

        const latestBP = await Store.getLatestBP();
        const latestUrine = await Store.getLatestUrine();
        const vitalsLogs = await Store.getLogs(Store.KEYS.VITALS_LOGS);
        const symptomsLogs = await Store.getTodaySymptoms();

        let score = 0;
        const factors = [];

        // ── STATIC RISK FACTORS ──
        if (profile.age < 20 || profile.age > 35) { score += 2; factors.push('Age risk'); }
        if (profile.isFirstPregnancy) { score += 2; factors.push('Nulliparity'); }
        if (profile.priorPE) { score += 4; factors.push('Prior PE history'); }
        if (profile.chronicHTN) { score += 3; factors.push('Chronic hypertension'); }
        if (profile.diabetes !== 'none') { score += 2; factors.push('Diabetes'); }
        if (profile.familyHistory) { score += 2; factors.push('Family history'); }
        if (profile.multipleGestation) { score += 2; factors.push('Multiple gestation'); }
        
        // Assume height is 160 and pre-weight is 65 if not set, just for fallback
        const height = profile.height || 160;
        const weight = profile.prePregnancyWeight || 65;
        if (this.calcBMI(weight, height) >= 30) { score += 2; factors.push('BMI ≥30'); }

        // ── DYNAMIC SIGNALS ──
        if (latestBP) {
            if (latestBP.sys >= 160 || latestBP.dia >= 110) { score += 7; factors.push('Severe-range BP'); }
            else if (latestBP.sys >= 140 || latestBP.dia >= 90) { score += 5; factors.push('BP ≥140/90'); }
            else if (latestBP.sys >= 130 || latestBP.dia >= 80) { score += 2; factors.push('Elevated BP'); }
        }

        // Urine Protein & Blood Glucose from Vitals
        if (vitalsLogs.length > 0) {
            const latestVital = vitalsLogs[0];
            
            // Proteinuria Logic
            const protein = latestVital.protein;
            if (protein === '+3') { score += 6; factors.push('Proteinuria 3+'); }
            else if (protein === '+2') { score += 4; factors.push('Proteinuria 2+'); }
            else if (protein === '+1') { score += 2; factors.push('Proteinuria 1+'); }
            else if (latestUrine) { 
                if (latestUrine.protein === '3plus') { score += 6; factors.push('Proteinuria 3+'); }
                else if (latestUrine.protein === '2plus') { score += 4; factors.push('Proteinuria 2+'); }
                else if (latestUrine.protein === '1plus') { score += 2; factors.push('Proteinuria 1+'); }
            }

            // Glucose Logic (GDM)
            const glucose = latestVital.glucose;
            if (glucose) {
                if (glucose >= 200) { score += 5; factors.push('Severe Hyperglycemia'); }
                else if (glucose >= 140) { score += 3; factors.push('Elevated Blood Glucose'); }
                else if (glucose < 60) { score += 4; factors.push('Hypoglycemia'); }
            }
        } else if (latestUrine) {
            if (latestUrine.protein === '3plus') { score += 6; factors.push('Proteinuria 3+'); }
            else if (latestUrine.protein === '2plus') { score += 4; factors.push('Proteinuria 2+'); }
            else if (latestUrine.protein === '1plus') { score += 2; factors.push('Proteinuria 1+'); }
        }

        // Symptoms (Aggregate from today's logs)
        const todaySymptoms = new Set();
        symptomsLogs.forEach(log => {
            if(log.symptoms) log.symptoms.forEach(s => todaySymptoms.add(s));
        });

        if (todaySymptoms.has('severe_headache')) { score += 2; factors.push('Severe headache'); }
        if (todaySymptoms.has('vision_changes')) { score += 2; factors.push('Visual disturbances'); }
        if (todaySymptoms.has('ruq_pain')) { score += 3; factors.push('RUQ/Epigastric pain'); }
        if (todaySymptoms.has('swelling')) { score += 1; factors.push('Sudden swelling'); }

        // Trend-based: rapid weight gain (compare last two readings)
        if (vitalsLogs.length >= 2) {
            const currentWeight = vitalsLogs[0].weight;
            const previousWeight = vitalsLogs[1].weight;
            const dateDiffDays = (new Date(vitalsLogs[0].timestamp) - new Date(vitalsLogs[1].timestamp)) / (1000 * 60 * 60 * 24);
            
            if (currentWeight && previousWeight && dateDiffDays > 0) {
                const weeklyGainRate = ((currentWeight - previousWeight) / dateDiffDays) * 7;
                if (weeklyGainRate >= 2) { score += 1; factors.push('Weight gain ≥2kg/wk'); }
            }
        }

        // ── RAG TRIAGE ──
        let band, color, action;
        if (score <= 5) { 
            band = 'Low';      
            color = '#436746'; 
            action = 'Continue routine monitoring'; 
        } else if (score <= 12) { 
            band = 'Moderate';  
            color = '#80543B'; 
            action = 'Increase BP logging frequency. Mention at next doctor visit.'; 
        } else if (score <= 20) { 
            band = 'High';      
            color = '#BA1A1A'; 
            action = 'Contact your healthcare provider today for an assessment.'; 
        } else { 
            band = 'Critical';  
            color = '#BA1A1A'; 
            action = 'EMERGENCY: Proceed to the nearest hospital immediately.'; 
        }

        // Trigger Alerts if state escalated
        this._checkAndTriggerAlerts(score, band, action);

        return { score, band, color, factors, action };
    },

    _checkAndTriggerAlerts(currentScore, band, action) {
        // Debounce or store last alert time to prevent spam
        const lastAlertStr = localStorage.getItem('gg_last_alert');
        const lastAlert = lastAlertStr ? JSON.parse(lastAlertStr) : { time: 0, band: '' };
        const now = Date.now();

        // If band changed to a higher risk, or 24 hours have passed in a high risk state
        if ((band !== 'Low' && band !== lastAlert.band) || 
            (band !== 'Low' && now - lastAlert.time > 86400000)) {
            
            if (band === 'Critical' || band === 'High') {
                // High priority toast
                UI.showToast(`ALERT: ${action}`, 'error', 10000);
            }
            
            localStorage.setItem('gg_last_alert', JSON.stringify({ time: now, band: band }));
        }
    }
};

window.Scoring = Scoring;

// Expose for HTML inline handlers
(window as any).Scoring = Scoring;
