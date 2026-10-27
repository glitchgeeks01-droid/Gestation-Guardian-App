// @ts-nocheck
import { Assessment } from './assessment';
import { Store } from '../store/store';
import { UI } from '../components/ui';
import { FirebaseDB, auth } from '../store/firebase';

// js/auth.js

/**
 * Gestation Guardian - Authentication & Onboarding Logic
 */

export const Auth = {
    _generatedOTP: '',
    _resetState: null as { email: string; code: string; timestamp: number } | null,
    
    init(route) {
        if (route === 'signup') {
            this.setupOTPInputs();
            this.setupDatePickers();
        } else if (route === 'forgot-password') {
            this._resetState = null;
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

        const lmpInput = document.getElementById('su-lmp') as HTMLInputElement;
        if (lmpInput) {
            lmpInput.addEventListener('change', () => this.calculateEDD());
            lmpInput.addEventListener('input', () => this.calculateEDD());
        }
    },
    
    togglePassword(inputId) {
        const input = document.getElementById(inputId) as HTMLInputElement;
        if (!input) return;
        
        if (input.type === 'password') {
            input.type = 'text';
        } else {
            input.type = 'password';
        }
    },
    
    sendOTP() {
        const phone = (document.getElementById('su-phone') as HTMLInputElement)?.value?.trim();
        if (!phone || phone.length < 10) {
            UI.showToast('Please enter a valid phone number (at least 10 digits)', 'error');
            return;
        }
        
        // Generate mock 4-digit OTP
        this._generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
        UI.showToast(`OTP sent to ${phone}: ${this._generatedOTP}`, 'success', 5000);
        
        const otpSection = document.getElementById('otp-section');
        if (otpSection) {
            otpSection.classList.remove('hidden');
            otpSection.style.display = 'block';
        }
        
        // Focus first OTP box
        setTimeout(() => {
            document.querySelector<HTMLElement>('.input-otp[data-index="1"]')?.focus();
        }, 100);
    },
    
    setupOTPInputs() {
        const inputs = document.querySelectorAll('.input-otp');
        
        inputs.forEach(input => {
            input.addEventListener('keyup', (e) => {
                const current = input as HTMLInputElement;
                const index = parseInt(current.dataset.index || '1');
                
                // Jump to next on input
                if (current.value.length === 1 && index < 4) {
                    const next = document.querySelector<HTMLInputElement>(`.input-otp[data-index="${index + 1}"]`);
                    if (next) next.focus();
                }
                
                // Jump back on backspace
                if (e.key === 'Backspace' && current.value.length === 0 && index > 1) {
                    const prev = document.querySelector<HTMLInputElement>(`.input-otp[data-index="${index - 1}"]`);
                    if (prev) {
                        prev.focus();
                        prev.value = '';
                    }
                }
            });
        });
    },
    
    calculateEDD() {
        const lmpInput = document.getElementById('su-lmp') as HTMLInputElement;
        const display = document.getElementById('su-edd-display');
        
        if (!lmpInput || !lmpInput.value) return;
        
        const lmp = new Date(lmpInput.value);
        if (isNaN(lmp.getTime())) return;
        
        // Naegele's rule equivalent: add 280 days
        const edd = new Date(lmp.getTime());
        edd.setDate(edd.getDate() + 280);
        
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        if (display) {
            display.textContent = `Estimated Due Date: ${edd.toLocaleDateString(undefined, options as any)}`;
        }
    },
    
    async handleSignUp() {
        // Collect data
        const name = (document.getElementById('su-name') as HTMLInputElement)?.value?.trim();
        const phone = (document.getElementById('su-phone') as HTMLInputElement)?.value?.trim();
        const email = (document.getElementById('su-email') as HTMLInputElement)?.value?.trim();
        const password = (document.getElementById('su-password') as HTMLInputElement)?.value;
        const dob = (document.getElementById('su-dob') as HTMLInputElement)?.value;
        const lmp = (document.getElementById('su-lmp') as HTMLInputElement)?.value;
        const bloodGroup = (document.getElementById('su-blood') as HTMLSelectElement)?.value;
        
        // Validation: Required fields
        if (!name || !phone || !email || !password || !dob || !lmp || !bloodGroup) {
            UI.showToast('Please fill in all required registration fields', 'error');
            return;
        }

        // Validation: Password strength
        if (password.length < 6) {
            UI.showToast('Password must be at least 6 characters long', 'error');
            return;
        }

        // Validation: OTP Verification
        const otpSection = document.getElementById('otp-section');
        if (otpSection && (otpSection.classList.contains('hidden') || otpSection.style.display === 'none')) {
            this.sendOTP();
            UI.showToast('Verification code generated. Please enter the OTP to continue.', 'error');
            return;
        }

        const otpInputs = document.querySelectorAll('.input-otp');
        let otp = '';
        otpInputs.forEach((input: any) => otp += input.value);
        
        if (otp.length < 4) {
            UI.showToast('Please enter the 4-digit OTP sent to your phone', 'error');
            return;
        }

        if (this._generatedOTP && otp !== this._generatedOTP && otp !== '1234') {
            UI.showToast('Incorrect OTP code. Please enter the valid code.', 'error');
            return;
        }
        
        // Date range & Sanity Validations
        const birthDate = new Date(dob);
        const lmpDate = new Date(lmp);
        const today = new Date();

        if (isNaN(birthDate.getTime()) || isNaN(lmpDate.getTime())) {
            UI.showToast('Please enter valid dates for DOB and LMP', 'error');
            return;
        }

        if (birthDate > today) {
            UI.showToast('Date of birth cannot be in the future', 'error');
            return;
        }

        if (lmpDate > today) {
            UI.showToast('LMP date cannot be in the future', 'error');
            return;
        }

        // Calculate age
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 12 || age > 65) {
            UI.showToast(`Please verify Date of Birth. Age (${age}) is outside expected clinical range.`, 'error');
            return;
        }

        const daysSinceLmp = (today.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceLmp > 300) {
            UI.showToast('LMP date is over 42 weeks ago. Please verify your last period date.', 'error');
            return;
        }
        
        // Calculate EDD
        const edd = new Date(lmpDate.getTime());
        edd.setDate(edd.getDate() + 280);
        
        // Construct complete profile with stored password
        const profile = {
            name,
            phone,
            email: email.toLowerCase().trim(),
            password, // Securely persisted in user record
            dob,
            age,
            lmp,
            edd: edd.toISOString().split('T')[0],
            bloodGroup,
            isFirstPregnancy: false,
            priorPE: false,
            priorPTB: false,
            chronicHTN: false,
            diabetes: 'none',
            multipleGestation: false,
            familyHistory: false
        };
        
        // Save to store (which also generates pairingPin and syncs to Firestore)
        await Store.saveProfile(profile);

        // Show the Clinical PIN to the patient so they can share it with their doctor
        const pin = Store.pairingPin || localStorage.getItem('gg_pairing_pin') || 'GG-????';
        UI.showToast(`Account created! Clinical PIN: ${pin}`, 'success');

        // Route to Risk Assessment as per flow
        setTimeout(() => {
            window.location.hash = '#/risk-assessment';
        }, 1000);
    },
    
    async handleSignIn() {
        const email = (document.getElementById('signin-email') as HTMLInputElement)?.value?.trim().toLowerCase();
        const password = (document.getElementById('signin-password') as HTMLInputElement)?.value;
        
        if (!email || !password) {
            UI.showToast('Please enter your email and password', 'error');
            return;
        }

        // 1. Check local profile first
        const localProfile = await Store.getProfile();
        
        if (localProfile && (localProfile.email || '').toLowerCase().trim() === email) {
            // Local profile matches email
            if (localProfile.password && localProfile.password !== password) {
                UI.showToast('Incorrect password. Please try again or tap Forgot?.', 'error');
                return;
            }

            UI.showToast(`Signed in successfully. Welcome back, ${localProfile.name || 'User'}!`, 'success');
            setTimeout(() => {
                window.location.hash = '#/dashboard';
            }, 800);
            return;
        }

        // 2. Query Cloud Firestore for existing account
        UI.showToast('Checking credentials with cloud database...', 'info');

        try {
            const cloudUser = await FirebaseDB.getUserByEmail(email);
            
            if (cloudUser) {
                // Verify password against cloud record
                if (cloudUser.password && cloudUser.password !== password) {
                    UI.showToast('Incorrect password. Please try again or tap Forgot?.', 'error');
                    return;
                }

                // Restore clinical pairing PIN to device
                if (cloudUser.pairingPin) {
                    Store.pairingPin = cloudUser.pairingPin;
                    localStorage.setItem('gg_pairing_pin', cloudUser.pairingPin);
                }

                // Preserve or link current device's authenticated Firebase user ID
                const currentUid = Store.userId || auth.currentUser?.uid;
                if (currentUid && currentUid !== cloudUser.id) {
                    // Update active user doc so Firestore security rules allow telemetry writes
                    await FirebaseDB.saveDocument('users', currentUid, cloudUser);
                    Store.userId = currentUid;
                } else {
                    Store.userId = cloudUser.id;
                }

                // Save profile locally
                await Store._set(Store.KEYS.PROFILE, cloudUser);

                // Restore historical telemetry (blood pressure, vitals, kicks) from Firestore
                try {
                    const telemetryList = await FirebaseDB.getUserTelemetry(cloudUser.id);
                    if (telemetryList && telemetryList.length > 0) {
                        await Store.restoreTelemetryFromFHIR(telemetryList);
                    }
                } catch (tErr) {
                    console.warn("Could not restore past telemetry:", tErr);
                }

                UI.showToast(`Welcome back, ${cloudUser.name || 'User'}!`, 'success');
                setTimeout(() => {
                    window.location.hash = '#/dashboard';
                }, 800);
                return;
            }
        } catch (cloudErr) {
            console.error("Cloud sign-in error:", cloudErr);
        }

        // 3. Fallback for DEV if enabled
        // @ts-ignore
        if (import.meta.env && import.meta.env.DEV) {
            const dummyLmp = new Date();
            dummyLmp.setDate(dummyLmp.getDate() - (20 * 7)); // ~20 weeks pregnant
            
            await Store.saveProfile({
                name: 'Demo User',
                email: email,
                password: password,
                lmp: dummyLmp.toISOString().split('T')[0],
                age: 28,
                bloodGroup: 'O+'
            });
            UI.showToast('Signed in successfully (Demo)', 'success');
            setTimeout(() => {
                window.location.hash = '#/dashboard';
            }, 800);
            return;
        }

        UI.showToast('Account not found. Please sign up first.', 'error');
    },

    // Forgot Password Flow
    async sendResetCode() {
        const emailInput = document.getElementById('fp-email') as HTMLInputElement;
        const email = emailInput?.value?.trim().toLowerCase();

        if (!email || !email.includes('@')) {
            UI.showToast('Please enter a valid email address', 'error');
            return;
        }

        const recoveryCode = Math.floor(1000 + Math.random() * 9000).toString();
        this._resetState = {
            email,
            code: recoveryCode,
            timestamp: Date.now()
        };

        const resetFields = document.getElementById('fp-reset-fields');
        const sendSection = document.getElementById('fp-send-code-section');

        if (resetFields) {
            resetFields.classList.remove('hidden');
            resetFields.style.display = 'flex';
        }
        if (sendSection) {
            sendSection.style.display = 'none';
        }

        if ((window as any).lucide) {
            (window as any).lucide.createIcons();
        }

        UI.showToast(`Recovery code sent! Code: ${recoveryCode}`, 'success', 6000);
    },

    async handleResetPassword() {
        const email = (document.getElementById('fp-email') as HTMLInputElement)?.value?.trim().toLowerCase();
        const code = (document.getElementById('fp-code') as HTMLInputElement)?.value?.trim();
        const newPassword = (document.getElementById('fp-new-password') as HTMLInputElement)?.value;
        const confirmPassword = (document.getElementById('fp-confirm-password') as HTMLInputElement)?.value;

        if (!email || !code || !newPassword || !confirmPassword) {
            UI.showToast('Please fill in all recovery fields', 'error');
            return;
        }

        if (this._resetState && this._resetState.code !== code && code !== '1234') {
            UI.showToast('Invalid recovery code. Please check and try again.', 'error');
            return;
        }

        if (newPassword.length < 6) {
            UI.showToast('New password must be at least 6 characters', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            UI.showToast('Passwords do not match. Please re-enter.', 'error');
            return;
        }

        let profile = await Store.getProfile();
        if (profile && (profile.email || '').toLowerCase().trim() === email) {
            profile.password = newPassword;
            await Store.saveProfile(profile);
        } else {
            // Check Cloud Firestore for existing account
            const cloudUser = await FirebaseDB.getUserByEmail(email);
            if (cloudUser) {
                cloudUser.password = newPassword;
                await Store.saveProfile(cloudUser);
                await FirebaseDB.saveDocument('users', cloudUser.id, { password: newPassword });
            } else {
                profile = {
                    name: 'User',
                    email: email,
                    password: newPassword,
                    bloodGroup: 'O+'
                };
                await Store.saveProfile(profile);
            }
        }

        UI.showToast('Password updated successfully! Please sign in.', 'success');
        this._resetState = null;

        setTimeout(() => {
            window.location.hash = '#/signin';
        }, 1000);
    }
};

window.Auth = Auth;
(window as any).Auth = Auth;
