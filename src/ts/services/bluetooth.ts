// @ts-nocheck
import { Store } from '../store/store';
import { UI } from '../components/ui';

// js/bluetooth.js

/**
 * Gestation Guardian - Bluetooth & IoT Device Manager
 * Stub for Terra SDK or native Android BLE bridge
 */

export const Bluetooth = {
    connectedDevices: [],
    
    init() {
        console.log('Bluetooth Manager Initialized');
        // Reset state on page load
        this.connectedDevices = [];
        this.updateUI();
    },
    
    connect(deviceType) {
        // Show connecting state
        UI.showToast(`Scanning for ${deviceType.toUpperCase()} devices...`, 'success', 2000);
        
        // Find the button that was clicked
        const cards = document.querySelectorAll('.card-device');
        let targetBtn = null;
        
        cards.forEach(card => {
            const btn = card.querySelector('button');
            if (btn && btn.getAttribute('onclick').includes(deviceType)) {
                targetBtn = btn;
            }
        });
        
        if (targetBtn) {
            const originalText = targetBtn.innerText;
            targetBtn.innerText = 'Connecting...';
            targetBtn.style.opacity = '0.7';
            
            // Mock connection delay
            setTimeout(() => {
                this.connectedDevices.push(deviceType);
                
                targetBtn.innerText = 'Connected';
                targetBtn.style.background = 'var(--clr-accent-green)';
                targetBtn.style.color = 'white';
                targetBtn.style.opacity = '1';
                targetBtn.disabled = true;
                
                UI.showToast(`${deviceType.toUpperCase()} Connected Successfully!`, 'success');
                
                this.updateUI();
            }, 2000);
        }
    },
    
    updateUI() {
        // In a real app, this would update the UI based on connected devices
        // For now, the connect() method handles the button state directly
    },
    
    // Stub for receiving data from the native Android side or Terra SDK
    async receiveData(deviceType, data) {
        console.log(`Received data from ${deviceType}:`, data);
        
        // Route data to the appropriate store
        if (deviceType === 'bp') {
            await Store.addLog(Store.KEYS.BP_LOGS, {
                date: new Date().toISOString().split('T')[0],
                time: new Date().toTimeString().split(' ')[0],
                sys: data.sys,
                dia: data.dia,
                pulse: data.pulse,
                position: 'sitting', // default for automated reading
                arm: 'left',
                notes: 'Auto-synced from BP Monitor'
            });
            UI.showToast('New Blood Pressure reading synced', 'success');
        } else if (deviceType === 'watch' || deviceType === 'spo2') {
            // e.g. HRV, Sleep, SpO2
        }
    }
};

window.Bluetooth = Bluetooth;

// Expose for HTML inline handlers
(window as any).Bluetooth = Bluetooth;
