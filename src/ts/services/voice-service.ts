/**
 * Voice Assistant Service (Speech-to-Text and Text-to-Speech)
 * Uses Web Speech API (SpeechRecognition and SpeechSynthesis)
 */

export class VoiceAssistant {
    private static recognition: any = null;
    private static isListening: boolean = false;
    private static isSpeechEnabled: boolean = true;
    private static onTranscriptCallback: ((text: string, isFinal: boolean) => void) | null = null;
    private static onStateChangeCallback: ((isListening: boolean) => void) | null = null;

    /**
     * Initialize Voice Recognition
     */
    static init() {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.isListening = true;
                if (this.onStateChangeCallback) this.onStateChangeCallback(true);
            };

            this.recognition.onresult = (event: any) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                if (finalTranscript && this.onTranscriptCallback) {
                    this.onTranscriptCallback(finalTranscript, true);
                } else if (interimTranscript && this.onTranscriptCallback) {
                    this.onTranscriptCallback(interimTranscript, false);
                }
            };

            this.recognition.onerror = (event: any) => {
                console.warn('Speech recognition error:', event.error);
                this.isListening = false;
                if (this.onStateChangeCallback) this.onStateChangeCallback(false);
            };

            this.recognition.onend = () => {
                this.isListening = false;
                if (this.onStateChangeCallback) this.onStateChangeCallback(false);
            };
        }

        // Check if TTS is enabled in local storage
        const savedTTS = localStorage.getItem('gg_ai_tts_enabled');
        if (savedTTS !== null) {
            this.isSpeechEnabled = savedTTS === 'true';
        }
    }

    /**
     * Start speech-to-text recording
     */
    static startListening(
        onTranscript: (text: string, isFinal: boolean) => void,
        onStateChange?: (isListening: boolean) => void
    ) {
        this.onTranscriptCallback = onTranscript;
        if (onStateChange) this.onStateChangeCallback = onStateChange;

        if (!this.recognition) {
            this.init();
        }

        if (!this.recognition) {
            alert("Voice recognition is not supported in this browser. Please type your message.");
            return;
        }

        try {
            if (this.isListening) {
                this.recognition.stop();
            } else {
                // Cancel any active speech synthesis before listening
                this.stopSpeaking();
                this.recognition.start();
            }
        } catch (e) {
            console.error("Speech recognition start failed:", e);
        }
    }

    /**
     * Stop listening
     */
    static stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    /**
     * Speak text using Web Speech Synthesis
     */
    static speak(text: string) {
        if (!this.isSpeechEnabled || !('speechSynthesis' in window)) return;

        // Clean markdown tags or bullets for clearer speech
        const cleanText = text
            .replace(/[*#_`]/g, '')
            .replace(/https?:\/\/\S+/g, '')
            .trim();

        if (!cleanText) return;

        try {
            window.speechSynthesis.cancel(); // Stop prior utterance
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.rate = 1.0;
            utterance.pitch = 1.05; // Slightly warm/friendly tone
            utterance.lang = 'en-US';

            // Select an English female voice if available
            const voices = window.speechSynthesis.getVoices();
            const femaleVoice = voices.find(v => 
                v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Google UK English Female') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Victoria'))
            );
            if (femaleVoice) {
                utterance.voice = femaleVoice;
            }

            window.speechSynthesis.speak(utterance);
        } catch (err) {
            console.error("Speech synthesis failed:", err);
        }
    }

    /**
     * Stop ongoing speech
     */
    static stopSpeaking() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }

    /**
     * Toggle Text-to-Speech audio feedback
     */
    static toggleTTS(): boolean {
        this.isSpeechEnabled = !this.isSpeechEnabled;
        localStorage.setItem('gg_ai_tts_enabled', String(this.isSpeechEnabled));
        if (!this.isSpeechEnabled) {
            this.stopSpeaking();
        }
        return this.isSpeechEnabled;
    }

    static isTTSEnabled(): boolean {
        return this.isSpeechEnabled;
    }
}
