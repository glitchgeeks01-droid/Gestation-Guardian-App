// @ts-nocheck
import { Assessment } from './assessment';
import { Store } from '../store/store';
import { UI } from '../components/ui';

// js/auth.js

/**
 * Gestation Guardian - Authentication & Onboarding Logic
 */

export const Auth = {
    
    init(route) {
        if (route === 'signup') {
            this.setupOTPInputs();
            this.setupDatePickers();
        }
    },
    
    setupDatePickers() {
        const dateInputs = document.querySelectorAll<HTMLInputElement>('input[type="date"]');
        dateInputs.forEach(input => {
            input.addEventListener('click', () => {
                if (typeof (input as any).showPicker === 'function') {
                    try { (input as any).showPicker(); } catch (e) {}
                }
            });
        });
    },
    
    togglePassword(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;
        
        if (input.type === 'password') {
            input.type = 'text';
        } else {
            input.type = 'password';
        }
    },
    
    sendOTP() {
        const phone = (document.getElementById('su-phone') as HTMLInputElement)?.value;
        if (!phone || phone.length < 10) {
            UI.showToast('Please enter a valid phone number', 'error');
            return;
        }
        
        // Mock sending OTP
        UI.showToast('OTP sent via SMS', 'success');
        document.getElementById('otp-section').classList.remove('hidden');
        
        // Focus first OTP box
        setTimeout(() => {
            document.querySelector<HTMLElement>('.input-otp[data-index="1"]')?.focus();
        }, 100);
    },
    
    setupOTPInputs() {
        const inputs = document.querySelectorAll('.input-otp');
        
        inputs.forEach(input => {
            input.addEventListener('keyup', (e) => {
                const current = input;
                const index = parseInt(current.dataset.index);
                
                // Jump to next on input
                if (current.value.length === 1 && index < 4) {
                    const next = document.querySelector(`.input-otp[data-index="${index + 1}"]`);
                    if (next) next.focus();
                }
                
                // Jump back on backspace
                if (e.key === 'Backspace' && current.value.length === 0 && index > 1) {
                    const prev = document.querySelector(`.input-otp[data-index="${index - 1}"]`);
                    if (prev) {
                        prev.focus();
                        prev.value = '';
                    }
                }
            });
        });
    },
    
    calculateEDD() {
        const lmpInput = document.getElementById('su-lmp');
        const display = document.getElementById('su-edd-display');
        
        if (!lmpInput || !lmpInput.value) return;
        
        const lmp = new Date(lmpInput.value);
        
        // Naegele's rule: add 7 days, subtract 3 months, add 1 year
        // Simpler equivalent: add 280 days
        const edd = new Date(lmp.getTime());
        edd.setDate(edd.getDate() + 280);
        
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        display.textContent = `Estimated Due Date: ${edd.toLocaleDateString(undefined, options)}`;
    },
    
    async handleSignUp() {
        // Collect data
        const name = (document.getElementById('su-name') as HTMLInputElement)?.value;
        const phone = (document.getElementById('su-phone') as HTMLInputElement)?.value;
        const email = (document.getElementById('su-email') as HTMLInputElement)?.value;
        const dob = (document.getElementById('su-dob') as HTMLInputElement)?.value;
        const lmp = (document.getElementById('su-lmp') as HTMLInputElement)?.value;
        const bloodGroup = (document.getElementById('su-blood') as HTMLSelectElement)?.value;
        
        // Validate OTP was entered (mock)
        const otpInputs = document.querySelectorAll('.input-otp');
        let otp = '';
        otpInputs.forEach(input => otp += input.value);
        
        if (otp.length < 4) {
            UI.showToast('Please verify your phone number with the OTP', 'error');
            return;
        }
        
        // Calculate age
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        // Calculate EDD
        const lmpDate = new Date(lmp);
        const edd = new Date(lmpDate.getTime());
        edd.setDate(edd.getDate() + 280);
        
        // Construct basic profile
        const profile = {
            name,
            phone,
            email,
            dob,
            age,
            lmp,
            edd: edd.toISOString().split('T')[0],
            bloodGroup,
            // Defaults to be filled later in the full risk assessment
            isFirstPregnancy: false,
            priorPE: false,
            priorPTB: false,
            chronicHTN: false,
            diabetes: 'none',
            multipleGestation: false,
            familyHistory: false
        };
        
        // Save to store
        await Store.saveProfile(profile);
        
        UI.showToast('Account created securely', 'success');
        
        // Route to Risk Assessment as per flow
        setTimeout(() => {
            window.location.hash = '#/risk-assessment';
        }, 1000);
    },
    
    async handleSignIn() {
        const email = (document.getElementById('signin-email') as HTMLInputElement)?.value;
        const password = (document.getElementById('signin-password') as HTMLInputElement)?.value;
        
        if (!email || !password) {
            UI.showToast('Please enter your credentials', 'error');
            return;
        }
        
        // Mock authentication - just create a dummy profile if none exists
        if (!(await Store.getProfile())) {
            // Give them a dummy profile so they can access the app
            const dummyLmp = new Date();
            dummyLmp.setDate(dummyLmp.getDate() - (20 * 7)); // roughly 20 weeks pregnant
            
            await Store.saveProfile({
                name: 'Demo User',
                email: email,
                lmp: dummyLmp.toISOString().split('T')[0],
                age: 28,
                bloodGroup: 'O+'
            });
        }
        
        UI.showToast('Signed in successfully', 'success');
        
        setTimeout(() => {
            window.location.hash = '#/dashboard';
        }, 1000);
    }
};

window.Auth = Auth;

// Expose for HTML inline handlers
(window as any).Auth = Auth;
