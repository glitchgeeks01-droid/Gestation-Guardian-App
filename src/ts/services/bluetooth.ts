// @ts-nocheck
import { Store } from '../store/store';
import { UI } from '../components/ui';

export const Bluetooth = {
    // Standard GATT Service UUIDs
    SERVICES: {
        BLOOD_PRESSURE: 0x1810,
        HEART_RATE: 0x180D
    },
    CHARACTERISTICS: {
        BP_MEASUREMENT: 0x2A35,
        HR_MEASUREMENT: 0x2A37
    },

    device: null as BluetoothDevice | null,
    server: null as BluetoothRemoteGATTServer | null,

    async connect(deviceType) {
        if (!navigator.bluetooth) {
            UI.showToast("Web Bluetooth API is not supported in this browser.", 'error');
            return false;
        }

        UI.showToast(`Scanning for ${deviceType.toUpperCase()} devices...`, 'success', 2000);

        try {
            this.device = await navigator.bluetooth.requestDevice({
                filters: [{ services: [this.SERVICES.BLOOD_PRESSURE] }],
                optionalServices: [this.SERVICES.HEART_RATE]
            });

            this.device.addEventListener('gattserverdisconnected', this.onDisconnected);
            this.server = await this.device.gatt?.connect() || null;
            
            if (this.server) {
                UI.showToast(`Connected to ${this.device.name}`, 'success');
                await this.startBPNotifications();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Bluetooth connection failed:", error);
            UI.showToast("Connection failed or was cancelled.", 'error');
            return false;
        }
    },

    onDisconnected(event: Event) {
        UI.showToast("Device disconnected.", 'error');
    },

    async startBPNotifications() {
        if (!this.server) return;
        try {
            const service = await this.server.getPrimaryService(this.SERVICES.BLOOD_PRESSURE);
            const characteristic = await service.getCharacteristic(this.CHARACTERISTICS.BP_MEASUREMENT);
            await characteristic.startNotifications();
            characteristic.addEventListener('characteristicvaluechanged', this.handleBPData.bind(this));
        } catch (error) {
            console.error("Error starting BP notifications", error);
        }
    },

    handleBPData(event: Event) {
        const characteristic = event.target as BluetoothRemoteGATTCharacteristic;
        const value = characteristic.value;
        if (!value) return;

        const flags = value.getUint8(0);
        
        const parseSFloat = (byteOffset: number) => {
            const raw = value.getUint16(byteOffset, true);
            const mantissa = raw & 0x0FFF; 
            return mantissa; 
        };

        const sys = parseSFloat(1);
        const dia = parseSFloat(3);
        const hr = parseSFloat(7); // Roughly where pulse usually sits in standard IEEE

        // Auto-fill the UI form if it's open
        const sysInput = document.getElementById('bp-sys');
        const diaInput = document.getElementById('bp-dia');
        const hrInput = document.getElementById('bp-pulse');
        
        if (sysInput) sysInput.value = sys;
        if (diaInput) diaInput.value = dia;
        if (hrInput && hr) hrInput.value = hr;
        
        UI.showToast(`Reading synced: ${sys}/${dia} mmHg`, 'success');
    }
};

window.Bluetooth = Bluetooth;
(window as any).Bluetooth = Bluetooth;
