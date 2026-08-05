// @ts-nocheck
import { Store } from '../store/store';
import { UI } from '../components/ui';

// js/kicks.js

/**
 * Gestation Guardian - Kick Counter & Contraction Timer Logic
 */

export const Kicks = {
    // Kick Counter State
    kickSessionActive: false,
    kickCount: 0,
    kickStartTime: null,
    kickInterval: null,
    
    // Contraction State
    isContractionActive: false,
    contractionStartTime: null,
    contractionInterval: null,
    lastContractionEndTime: null, // used to calculate frequency
    currentContractionDuration: 0,
    
    // ─── KICK COUNTER ───
    
    init() {
        const btn = document.getElementById('kick-control-btn');
        if (btn) {
            btn.addEventListener('mousedown', () => btn.style.transform = 'scale(0.95)');
            btn.addEventListener('mouseup', () => btn.style.transform = 'scale(1)');
            btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
            
            btn.addEventListener('touchstart', () => btn.style.transform = 'scale(0.95)');
            btn.addEventListener('touchend', () => btn.style.transform = 'scale(1)');
        }
    },
    
    toggleSession() {
        const btn = document.getElementById('kick-control-btn');
        if (!btn) return;
        
        if (this.kickSessionActive) {
            this.endKickSession();
            btn.textContent = 'Start Session';
            btn.classList.replace('btn-danger', 'btn-secondary');
        } else {
            this.startKickSession();
            btn.textContent = 'End Session';
            btn.classList.replace('btn-secondary', 'btn-danger');
            btn.style.background = 'var(--clr-danger)';
            btn.style.color = 'white';
        }
    },
    
    startKickSession() {
        this.kickSessionActive = true;
        this.kickCount = 0;
        this.kickStartTime = Date.now();
        
        this.updateKickDisplay();
        
        this.kickInterval = setInterval(() => {
            this.updateKickTimer();
        }, 1000);
        
        UI.showToast('Session started. Tap the circle when you feel a kick.');
    },
    
    async endKickSession() {
        this.kickSessionActive = false;
        clearInterval(this.kickInterval);
        
        const durationSeconds = Math.floor((Date.now() - this.kickStartTime) / 1000);
        
        // Save to store if there was at least 1 minute or 1 kick
        if (durationSeconds > 60 || this.kickCount > 0) {
            await Store.addLog(Store.KEYS.KICKS, {
                date: new Date().toISOString().split('T')[0],
                time: new Date().toTimeString().split(' ')[0],
                count: this.kickCount,
                durationSeconds: durationSeconds
            });
            UI.showToast(`Session saved: ${this.kickCount} kicks in ${this.formatTime(durationSeconds)}`, 'success');
        }
        
        // Reset UI
        this.kickCount = 0;
        this.updateKickDisplay();
        document.getElementById('kick-timer-display').textContent = '00:00';
    },
    
    logKick() {
        if (!this.kickSessionActive) {
            // Auto-start session if they tap without starting
            this.toggleSession();
        }
        
        this.kickCount++;
        this.updateKickDisplay();
        
        // Haptic feedback
        UI.haptic();
        
        if (this.kickCount >= 10) {
            const duration = Math.floor((Date.now() - this.kickStartTime) / 1000);
            UI.showToast(`Great! 10 kicks reached in ${this.formatTime(duration)}.`, 'success');
            // Don't auto-stop, they might want to keep counting
        }
    },
    
    updateKickDisplay() {
        const display = document.getElementById('kick-count-display');
        if (display) display.textContent = this.kickCount;
    },
    
    updateKickTimer() {
        const display = document.getElementById('kick-timer-display');
        if (!display) return;
        
        const seconds = Math.floor((Date.now() - this.kickStartTime) / 1000);
        display.textContent = this.formatTime(seconds);
    },
    
    // ─── CONTRACTION TIMER ───
    
    async initContractions() {
        await this.updateContractionAverages();
    },
    
    async toggleContraction() {
        const btn = document.getElementById('contraction-button');
        const stateTxt = document.getElementById('contraction-state-display');
        const timerTxt = document.getElementById('contraction-timer-display');
        
        if (!btn || !stateTxt) return;
        
        if (this.isContractionActive) {
            // End contraction
            this.isContractionActive = false;
            clearInterval(this.contractionInterval);
            
            const durationSec = Math.floor((Date.now() - this.contractionStartTime) / 1000);
            
            let frequencySec = null;
            if (this.lastContractionEndTime) {
                // Frequency is calculated from START of previous to START of current
                // But commonly users track from END of previous to START of current (Rest time)
                // Clinical standard: START to START.
                // For simplicity here, we'll log the rest time (gap) between them.
                frequencySec = Math.floor((this.contractionStartTime - this.lastContractionEndTime) / 1000);
            }
            
            this.lastContractionEndTime = Date.now();
            
            // Log it
            if (durationSec > 10) { // filter out accidental taps
                await Store.addLog(Store.KEYS.CONTRACTIONS, {
                    timestamp: new Date().toISOString(),
                    durationSec: durationSec,
                    frequencySec: frequencySec // null for the first one
                });
                
                await this.updateContractionAverages();
            }
            
            // Reset UI
            btn.style.background = 'var(--clr-bg-white)';
            btn.style.borderColor = 'var(--clr-purple-bg)';
            stateTxt.innerHTML = 'Tap to<br>Start';
            stateTxt.style.color = 'var(--clr-purple)';
            timerTxt.style.display = 'none';
            
        } else {
            // Start contraction
            this.isContractionActive = true;
            this.contractionStartTime = Date.now();
            
            if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
            
            // Update UI
            btn.style.background = 'var(--clr-purple-bg)';
            btn.style.borderColor = 'var(--clr-purple)';
            stateTxt.textContent = 'Contracting...';
            stateTxt.style.color = 'white';
            
            timerTxt.style.display = 'block';
            timerTxt.style.color = 'white';
            timerTxt.textContent = '00:00';
            
            this.contractionInterval = setInterval(() => {
                const sec = Math.floor((Date.now() - this.contractionStartTime) / 1000);
                timerTxt.textContent = this.formatTime(sec);
            }, 1000);
        }
    },
    
    async updateContractionAverages() {
        const logs = await Store.getLogs(Store.KEYS.CONTRACTIONS);
        if (logs.length === 0) return;
        
        // Only look at the last 5 logs for relevant averages
        const recent = logs.slice(0, 5);
        
        let sumDuration = 0;
        let sumFreq = 0;
        let freqCount = 0;
        
        recent.forEach(log => {
            sumDuration += log.durationSec;
            if (log.frequencySec) {
                sumFreq += log.frequencySec;
                freqCount++;
            }
        });
        
        const avgDur = sumDuration / recent.length;
        document.getElementById('avg-duration').textContent = this.formatTime(Math.round(avgDur));
        
        if (freqCount > 0) {
            const avgFreq = sumFreq / freqCount;
            // Format frequency as M:SS
            const m = Math.floor(avgFreq / 60);
            const s = Math.round(avgFreq % 60);
            document.getElementById('avg-frequency').textContent = `${m}m ${s}s apart`;
        }
    },
    
    // ─── UTILS ───
    
    formatTime(totalSeconds) {
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }
};

window.Kicks = Kicks;

// Expose for HTML inline handlers
(window as any).Kicks = Kicks;
