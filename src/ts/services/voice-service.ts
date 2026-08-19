/**
 * Voice Assistant Service (Whisper Audio Recording + Speech Synthesis)
 * Uses MediaRecorder + OpenAI Whisper API for Voice-to-Text
 * and Web Speech Synthesis API for audio spoken responses.
 */

export class VoiceAssistant {
    private static mediaRecorder: MediaRecorder | null = null;
    private static isRecording: boolean = false;
    private static isSpeechEnabled: boolean = true;
    private static speechRecognition: any = null;
    private static onTranscriptCallback: ((text: string, isFinal: boolean) => void) | null = null;
    private static onStateChangeCallback: ((isListening: boolean) => void) | null = null;
    private static activeUtterances: SpeechSynthesisUtterance[] = [];
    private static audioContextUnlocked: boolean = false;
    private static currentSpeechId: number = 0;

    /**
     * Initialize Voice Assistant
     */
    static init() {
        // Unlock audio context on user gesture
        const unlockAudio = () => {
            if (this.audioContextUnlocked) return;
            this.audioContextUnlocked = true;
            if ('speechSynthesis' in window) {
                try {
                    const silentUtterance = new SpeechSynthesisUtterance('');
                    silentUtterance.volume = 0;
                    window.speechSynthesis.speak(silentUtterance);
                    window.speechSynthesis.resume();
                } catch (_) {}
            }
            window.removeEventListener('touchstart', unlockAudio);
            window.removeEventListener('click', unlockAudio);
        };
        window.addEventListener('touchstart', unlockAudio, { passive: true });
        window.addEventListener('click', unlockAudio, { passive: true });

        // Initialize Web Speech Recognition
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            try {
                this.speechRecognition = new SpeechRecognition();
                this.speechRecognition.continuous = false;
                this.speechRecognition.interimResults = true;
                this.speechRecognition.lang = 'en-US';

                this.speechRecognition.onresult = (event: any) => {
                    let interim = '';
                    let finalStr = '';
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalStr += event.results[i][0].transcript;
                        } else {
                            interim += event.results[i][0].transcript;
                        }
                    }
                    const recognized = finalStr + interim;
                    if (recognized && this.onTranscriptCallback) {
                        const isFinal = finalStr.length > 0 && interim.length === 0;
                        this.onTranscriptCallback(recognized, isFinal);
                    }
                };

                this.speechRecognition.onerror = (e: any) => {
                    console.warn("Speech recognition notice:", e.error);
                };

                this.speechRecognition.onend = () => {
                    if (this.isRecording && !this.mediaRecorder) {
                        this.isRecording = false;
                        if (this.onStateChangeCallback) this.onStateChangeCallback(false);
                    }
                };
            } catch (e) {
                console.warn("SpeechRecognition init note:", e);
            }
        } else {
            // Speech recognition not supported – show UI notice
            this.speechRecognition = null;
            if ((window as any).UI && typeof (window as any).UI.showToast === 'function') {
                (window as any).UI.showToast('Speech recognition is not supported on this browser', 'warning');
            }
        }

        // Restore TTS preference
        const savedTTS = localStorage.getItem('gg_ai_tts_enabled');
        if (savedTTS !== null) {
            this.isSpeechEnabled = savedTTS === 'true';
        }

        // Preload voices
        if ('speechSynthesis' in window) {
            try {
                window.speechSynthesis.getVoices();
                window.speechSynthesis.onvoiceschanged = () => {
                    window.speechSynthesis.getVoices();
                };
            } catch (_) {}
        }
    }

    /**
     * Start or toggle voice recording
     */
    static async startListening(
        onTranscript: (text: string, isFinal: boolean) => void,
        onStateChange?: (isListening: boolean) => void
    ) {
        this.onTranscriptCallback = onTranscript;
        this.onStateChangeCallback = onStateChange !== undefined ? onStateChange : null;

        // Cancel any active speech synthesis before recording
        this.stopSpeaking();

        if (this.isRecording) {
            this.stopListening();
            return;
        }

        this.isRecording = true;
        if (this.onStateChangeCallback) this.onStateChangeCallback(true);

        // 1. Start Web Speech Recognition concurrently for immediate live transcription
        if (this.speechRecognition) {
            try {
                this.speechRecognition.start();
            } catch (_) {}
        }

        // 2. Start MediaRecorder for OpenAI Whisper
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const localAudioChunks: Blob[] = [];

                let options: MediaRecorderOptions = {};
                if (typeof MediaRecorder.isTypeSupported === 'function') {
                    if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
                        options = { mimeType: 'audio/webm;codecs=opus' };
                    } else if (MediaRecorder.isTypeSupported('audio/webm')) {
                        options = { mimeType: 'audio/webm' };
                    } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
                        options = { mimeType: 'audio/mp4' };
                    }
                }

                this.mediaRecorder = new MediaRecorder(stream, options);

                this.mediaRecorder.ondataavailable = (e) => {
                    if (e.data && e.data.size > 0) {
                        localAudioChunks.push(e.data);
                    }
                };

                this.mediaRecorder.onstop = async () => {
                    // Stop audio stream tracks
                    stream.getTracks().forEach(track => track.stop());

                    const mimeType = options.mimeType || 'audio/webm';
                    const audioBlob = new Blob(localAudioChunks, { type: mimeType });
                    if (audioBlob.size > 0) {
                        await this.transcribeWithWhisper(audioBlob);
                    }
                };

                this.mediaRecorder.start(250);
                return;
            } catch (err) {
                // Show user-visible notice when mic access is denied
                this.isRecording = false;
                if (this.onStateChangeCallback) this.onStateChangeCallback(false);
                if (this.speechRecognition) {
                    try {
                        this.speechRecognition.stop();
                    } catch (_) {}
                }
                if ((window as any).UI && typeof (window as any).UI.showToast === 'function') {
                    (window as any).UI.showToast('Microphone access denied – voice features disabled', 'warning');
                }
                console.warn("getUserMedia error:", err);
            }
        }
    }

    /**
     * Stop voice recording
     */
    static stopListening() {
        this.isRecording = false;
        if (this.onStateChangeCallback) this.onStateChangeCallback(false);

        if (this.mediaRecorder) {
            if (this.mediaRecorder.state !== 'inactive') {
                try {
                    this.mediaRecorder.stop();
                } catch (_) {}
            }
            this.mediaRecorder = null;
        }
        if (this.speechRecognition) {
            try {
                this.speechRecognition.stop();
            } catch (_) {}
        }
    }

    /**
     * Send recorded audio blob to OpenAI Whisper API for voice-to-text transcription
     */
    private static async transcribeWithWhisper(audioBlob: Blob) {
        const apiKey = localStorage.getItem('gg_openai_api_key') || (window as any).OPENAI_API_KEY || '';

        if (apiKey) {
            try {
                const formData = new FormData();
                const extension = audioBlob.type.includes('mp4') ? 'mp4' : 'webm';
                formData.append('file', audioBlob, `audio.${extension}`);
                formData.append('model', 'whisper-1');
                formData.append('language', 'en');

                const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data && data.text && this.onTranscriptCallback) {
                        this.onTranscriptCallback(data.text.trim(), true);
                    }
                }
            } catch (err) {
                console.warn("OpenAI Whisper API error:", err);
            }
        }
    }

    /**
     * Speak response aloud with Web Speech Synthesis (sentence-chunked for Android stability)
     */
    static speak(text: string) {
        if (!this.isSpeechEnabled || !('speechSynthesis' in window)) return;

        // Clean markdown, symbols, and links for spoken audio
        const cleanText = text
            .replace(/[*#_`>]/g, '')
            .replace(/https?:\/\/\S+/g, '')
            .replace(/[⚠️🩺🥗👶⏱️🛌🍵🤰]/g, '')
            .trim();

        if (!cleanText) return;

        try {
            this.stopSpeaking();

            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
            }

            // Split into sentences so Android WebView doesn't pause or truncate long speech
            const sentences = cleanText.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [cleanText];
            
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => 
                v.lang.startsWith('en') && (
                    v.name.includes('Female') || 
                    v.name.includes('Natural') || 
                    v.name.includes('Google') || 
                    v.name.includes('Samantha') || 
                    v.name.includes('Victoria')
                )
            ) || voices.find(v => v.lang.startsWith('en')) || null;

            const speechId = this.currentSpeechId;

            let index = 0;
            const speakNext = () => {
                if (speechId !== this.currentSpeechId) return;
                if (index >= sentences.length || !this.isSpeechEnabled) return;
                const sentence = sentences[index++].trim();
                if (!sentence) {
                    speakNext();
                    return;
                }

                const utterance = new SpeechSynthesisUtterance(sentence);
                utterance.rate = 1.0;
                utterance.pitch = 1.05;
                if (preferredVoice) {
                    utterance.voice = preferredVoice;
                    utterance.lang = preferredVoice.lang;
                } else {
                    utterance.lang = 'en-US';
                }

                // Prevent garbage collection bug in Chrome/WebView by storing utterance
                this.activeUtterances.push(utterance);

                utterance.onend = () => {
                    const idx = this.activeUtterances.indexOf(utterance);
                    if (idx > -1) this.activeUtterances.splice(idx, 1);
                    speakNext();
                };

                utterance.onerror = (e) => {
                    console.warn("Utterance notice:", e);
                    const idx = this.activeUtterances.indexOf(utterance);
                    if (idx > -1) this.activeUtterances.splice(idx, 1);
                    speakNext();
                };

                window.speechSynthesis.speak(utterance);
            };

            // Small delay to allow any pending cancel() to clear
            setTimeout(() => {
                speakNext();
            }, 50);
        } catch (err) {
            console.error("Speech synthesis failed:", err);
        }
    }

    /**
     * Stop ongoing audio playback
     */
    static stopSpeaking() {
        this.currentSpeechId++;
        if ('speechSynthesis' in window) {
            try {
                window.speechSynthesis.cancel();
                this.activeUtterances = [];
            } catch (_) {}
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

    static isCurrentlyListening(): boolean {
        return this.isRecording;
    }
}
