// @ts-nocheck
import { Assessment } from './assessment';
import { Store } from '../store/store';
import { UI } from '../components/ui';
import { FirebaseDB, auth } from '../store/firebase';
import { hashPassword } from '../utils/crypto';

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
            this.setupSynchronizedInputs();
        } else if (route === 'forgot-password') {
            this._resetState = null;
        }
    },

    setupSynchronizedInputs() {
        const dobEl = document.getElementById('su-dob') as HTMLInputElement;
        const ageEl = document.getElementById('su-age') as HTMLInputElement;
        const ageDisplay = document.getElementById('su-age-display');

        if (dobEl && ageEl) {
            dobEl.addEventListener('change', () => {
                if (dobEl.value) {
                    const b = new Date(dobEl.value);
                    if (!isNaN(b.getTime())) {
                        const calculatedAge = Math.floor((new Date().getTime() - b.getTime()) / (365.25 * 24 * 3600 * 1000));
                        ageEl.value = String(calculatedAge);
                        if (ageDisplay) ageDisplay.textContent = `Age: ${calculatedAge} yrs`;
                    }
                }
            });
            ageEl.addEventListener('input', () => {
                const a = parseInt(ageEl.value, 10);
                if (!isNaN(a) && a >= 12 && a <= 65) {
                    const d = new Date();
                    d.setFullYear(d.getFullYear() - a);
                    dobEl.value = d.toISOString().split('T')[0];
                    if (ageDisplay) ageDisplay.textContent = `Age: ${a} yrs`;
                }
            });
        }

        const lmpEl = document.getElementById('su-lmp') as HTMLInputElement;
        const weeksEl = document.getElementById('su-weeks') as HTMLInputElement;
        const weeksDisplay = document.getElementById('su-weeks-display');

        if (lmpEl && weeksEl) {
            lmpEl.addEventListener('change', () => {
                if (lmpEl.value) {
                    const l = new Date(lmpEl.value);
                    if (!isNaN(l.getTime())) {
                        const calculatedWeeks = Math.floor(Math.abs(new Date().getTime() - l.getTime()) / (7 * 24 * 3600 * 1000));
                        weeksEl.value = String(calculatedWeeks);
                        if (weeksDisplay) weeksDisplay.textContent = `Week ${calculatedWeeks}`;
                    }
                }
            });
            weeksEl.addEventListener('input', () => {
                const w = parseInt(weeksEl.value, 10);
                if (!isNaN(w) && w >= 1 && w <= 42) {
                    const d = new Date();
                    d.setDate(d.getDate() - (w * 7));
                    lmpEl.value = d.toISOString().split('T')[0];
                    if (weeksDisplay) weeksDisplay.textContent = `Week ${w}`;
                    this.calculateEDD();
                }
            });
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
        console.info('[AUTH DEV] Active OTP:', this._generatedOTP);
        UI.showToast(`OTP sent to ${phone}: ${this._generatedOTP}`, 'success', 5000);
        
        const otpSection = document.getElementById('otp-section');
        if (otpSection) {
            otpSection.classList.remove('hidden');
            otpSection.style.display = 'block';
        }
        
        // Focus OTP input
        setTimeout(() => {
            document.getElementById('su-otp')?.focus();
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
        let dob = (document.getElementById('su-dob') as HTMLInputElement)?.value;
        const ageInput = (document.getElementById('su-age') as HTMLInputElement)?.value;
        let lmp = (document.getElementById('su-lmp') as HTMLInputElement)?.value;
        const weeksInput = (document.getElementById('su-weeks') as HTMLInputElement)?.value;
        let bloodGroup = (document.getElementById('su-blood') as HTMLSelectElement)?.value;
        
        // Validation: Required core credentials
        if (!name || !phone || !email || !password) {
            UI.showToast('Please fill in your name, phone, email, and password', 'error');
            return;
        }

        // Validation: Password strength
        if (password.length < 6) {
            UI.showToast('Password must be at least 6 characters long', 'error');
            return;
        }

        // Derive or default DOB if omitted
        if (!dob && ageInput) {
            const targetAge = parseInt(ageInput, 10);
            if (!isNaN(targetAge) && targetAge >= 12 && targetAge <= 65) {
                const derivedDob = new Date();
                derivedDob.setFullYear(derivedDob.getFullYear() - targetAge);
                dob = derivedDob.toISOString().split('T')[0];
            }
        }
        if (!dob) {
            const defaultDob = new Date();
            defaultDob.setFullYear(defaultDob.getFullYear() - 28);
            dob = defaultDob.toISOString().split('T')[0];
        }

        // Derive or default LMP if omitted
        if (!lmp && weeksInput) {
            const targetWeeks = parseInt(weeksInput, 10);
            if (!isNaN(targetWeeks) && targetWeeks >= 1 && targetWeeks <= 42) {
                const derivedLmp = new Date();
                derivedLmp.setDate(derivedLmp.getDate() - (targetWeeks * 7));
                lmp = derivedLmp.toISOString().split('T')[0];
            }
        }
        if (!lmp) {
            const defaultLmp = new Date();
            defaultLmp.setDate(defaultLmp.getDate() - (24 * 7));
            lmp = defaultLmp.toISOString().split('T')[0];
        }

        if (!bloodGroup) {
            bloodGroup = 'O+';
        }

        // Validation: OTP Verification
        const otpSection = document.getElementById('otp-section');
        if (otpSection && (otpSection.classList.contains('hidden') || otpSection.style.display === 'none')) {
            this.sendOTP();
            UI.showToast('Verification code generated. Please enter the OTP to continue.', 'error');
            return;
        }

        let otp = (document.getElementById('su-otp') as HTMLInputElement)?.value?.trim() || '';
        if (!otp) {
            const otpInputs = document.querySelectorAll('.input-otp');
            otpInputs.forEach((input: any) => otp += input.value);
        }
        
        if (otp.length < 4) {
            UI.showToast('Please enter the 4-digit OTP sent to your phone', 'error');
            return;
        }

        console.info('[AUTH DEV] Active OTP:', this._generatedOTP);
        const isDev = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const isOtpValid = (this._generatedOTP && otp === this._generatedOTP) || (isDev && otp === '1234');
        if (!isOtpValid) {
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
        let age = ageInput ? parseInt(ageInput, 10) : (today.getFullYear() - birthDate.getFullYear());
        const m = today.getMonth() - birthDate.getMonth();
        if (!ageInput && (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))) {
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

        const calculatedWeeks = weeksInput ? parseInt(weeksInput, 10) : Math.max(1, Math.min(42, Math.floor(daysSinceLmp / 7)));
        
        // Calculate EDD
        const edd = new Date(lmpDate.getTime());
        edd.setDate(edd.getDate() + 280);
        
        // Construct complete profile with stored password hash
        const passwordHash = await hashPassword(password);
        const profile = {
            name,
            phone,
            email: email.toLowerCase().trim(),
            passwordHash,
            dob,
            age,
            lmp,
            weeks: calculatedWeeks,
            gestationalWeeks: calculatedWeeks,
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

        const inputHash = await hashPassword(password);

        // 1. Check local profile first
        const localProfile = await Store.getProfile();
        
        if (localProfile && (localProfile.email || '').toLowerCase().trim() === email) {
            // Local profile matches email
            let localValid = false;
            if (localProfile.passwordHash) {
                localValid = localProfile.passwordHash === inputHash;
            } else if (localProfile.password) {
                if (localProfile.password === password) {
                    localProfile.passwordHash = inputHash;
                    delete localProfile.password;
                    await Store.saveProfile(localProfile);
                    localValid = true;
                }
            }

            if (!localValid) {
                UI.showToast('Problem with email or password, please check again.', 'error');
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
                let cloudValid = false;
                if (cloudUser.passwordHash) {
                    cloudValid = cloudUser.passwordHash === inputHash;
                } else if (cloudUser.password) {
                    // Migration fallback: If user doc only has legacy plaintext password:
                    if (password === cloudUser.password) {
                        cloudUser.passwordHash = inputHash;
                        delete cloudUser.password;
                        await FirebaseDB.saveDocument('users', cloudUser.id, { passwordHash: inputHash });
                        await Store.saveProfile(cloudUser);
                        cloudValid = true;
                    }
                }

                if (!cloudValid) {
                    UI.showToast('Problem with email or password, please check again.', 'error');
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

        UI.showToast('Problem with email or password, please check again.', 'error');
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
        console.info('[AUTH DEV] Active OTP:', this._resetState.code);

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

        console.info('[AUTH DEV] Active OTP:', this._resetState?.code);
        const isDev = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const isResetValid = (this._resetState && this._resetState.code === code) || (isDev && code === '1234');
        if (!isResetValid) {
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

        const newHash = await hashPassword(newPassword);

        let profile = await Store.getProfile();
        if (profile && (profile.email || '').toLowerCase().trim() === email) {
            profile.passwordHash = newHash;
            delete profile.password;
            await Store.saveProfile(profile);
        } else {
            // Check Cloud Firestore for existing account
            const cloudUser = await FirebaseDB.getUserByEmail(email);
            if (cloudUser) {
                cloudUser.passwordHash = newHash;
                delete cloudUser.password;
                await Store.saveProfile(cloudUser);
                await FirebaseDB.saveDocument('users', cloudUser.id, { passwordHash: newHash });
            } else {
                profile = {
                    name: 'User',
                    email: email,
                    passwordHash: newHash,
                    bloodGroup: 'O+'
                };
                delete profile.password;
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
