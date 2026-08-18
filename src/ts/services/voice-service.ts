/**
 * Voice Assistant Service (Whisper Audio Recording + Speech Synthesis)
 * Uses MediaRecorder + OpenAI Whisper API for Voice-to-Text
 * and Web Speech Synthesis API for audio spoken responses.
 */

export class VoiceAssistant {
    private static mediaRecorder: MediaRecorder | null = null;
    private static audioChunks: Blob[] = [];
    private static isRecording: boolean = false;
    private static isSpeechEnabled: boolean = true;
    private static speechRecognition: any = null;
    private static onTranscriptCallback: ((text: string, isFinal: boolean) => void) | null = null;
    private static onStateChangeCallback: ((isListening: boolean) => void) | null = null;
    private static activeUtterance: SpeechSynthesisUtterance | null = null;

    /**
     * Initialize Voice Assistant
     */
    static init() {
        // Initialize Web Speech Recognition as supplementary fallback if available
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
                    if (finalStr && this.onTranscriptCallback) {
                        this.onTranscriptCallback(finalStr, true);
                    } else if (interim && this.onTranscriptCallback) {
                        this.onTranscriptCallback(interim, false);
                    }
                };

                this.speechRecognition.onend = () => {
                    if (!this.isRecording) {
                        if (this.onStateChangeCallback) this.onStateChangeCallback(false);
                    }
                };
            } catch (e) {
                console.warn("SpeechRecognition init note:", e);
            }
        }

        // Restore TTS preference
        const savedTTS = localStorage.getItem('gg_ai_tts_enabled');
        if (savedTTS !== null) {
            this.isSpeechEnabled = savedTTS === 'true';
        }

        // Preload voices
        if ('speechSynthesis' in window) {
            window.speechSynthesis.onvoiceschanged = () => {
                window.speechSynthesis.getVoices();
            };
        }
    }

    /**
     * Start voice recording (MediaRecorder for OpenAI Whisper / WebRTC)
     */
    static async startListening(
        onTranscript: (text: string, isFinal: boolean) => void,
        onStateChange?: (isListening: boolean) => void
    ) {
        this.onTranscriptCallback = onTranscript;
        if (onStateChange) this.onStateChangeCallback = onStateChange;

        // Cancel any active speech synthesis before recording
        this.stopSpeaking();

        if (this.isRecording) {
            this.stopListening();
            return;
        }

        // Try modern MediaRecorder with getUserMedia (ideal for OpenAI Whisper)
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.audioChunks = [];
                
                // Use standard audio/webm or audio/mp4 depending on support
                let mimeType = 'audio/webm';
                if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
                    mimeType = 'audio/webm;codecs=opus';
                } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
                    mimeType = 'audio/mp4';
                }

                this.mediaRecorder = new MediaRecorder(stream, { mimeType });

                this.mediaRecorder.ondataavailable = (e) => {
                    if (e.data && e.data.size > 0) {
                        this.audioChunks.push(e.data);
                    }
                };

                this.mediaRecorder.onstart = () => {
                    this.isRecording = true;
                    if (this.onStateChangeCallback) this.onStateChangeCallback(true);
                };

                this.mediaRecorder.onstop = async () => {
                    this.isRecording = false;
                    if (this.onStateChangeCallback) this.onStateChangeCallback(false);
                    
                    // Stop audio stream tracks
                    stream.getTracks().forEach(track => track.stop());

                    const audioBlob = new Blob(this.audioChunks, { type: mimeType });
                    if (audioBlob.size > 0) {
                        await this.transcribeWithWhisper(audioBlob);
                    }
                };

                this.mediaRecorder.start(250); // Collect data chunks every 250ms

                // Also run speech recognition concurrently for instant live preview if available
                if (this.speechRecognition) {
                    try { this.speechRecognition.start(); } catch (_) {}
                }

                return;
            } catch (err) {
                console.warn("getUserMedia error, falling back to Web Speech:", err);
            }
        }

        // Fallback to SpeechRecognition if getUserMedia is unavailable
        if (this.speechRecognition) {
            try {
                this.isRecording = true;
                if (this.onStateChangeCallback) this.onStateChangeCallback(true);
                this.speechRecognition.start();
            } catch (e) {
                console.error("Speech recognition start failed:", e);
                if (this.onStateChangeCallback) this.onStateChangeCallback(false);
                this.isRecording = false;
            }
        } else {
            alert("Microphone recording is not supported in this browser. Please type your query.");
        }
    }

    /**
     * Stop voice recording
     */
    static stopListening() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }
        if (this.speechRecognition) {
            try { this.speechRecognition.stop(); } catch (_) {}
        }
        this.isRecording = false;
        if (this.onStateChangeCallback) this.onStateChangeCallback(false);
    }

    /**
     * Send recorded audio blob to OpenAI Whisper API for voice-to-text transcription
     */
    private static async transcribeWithWhisper(audioBlob: Blob) {
        const apiKey = localStorage.getItem('gg_openai_api_key') || (window as any).OPENAI_API_KEY || '';

        if (apiKey) {
            try {
                const formData = new FormData();
                formData.append('file', audioBlob, 'audio.webm');
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
                        return;
                    }
                }
            } catch (err) {
                console.warn("OpenAI Whisper API transcription error, using current text:", err);
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
            window.speechSynthesis.cancel(); // Stop prior audio

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

            let index = 0;
            const speakNext = () => {
                if (index >= sentences.length || !this.isSpeechEnabled) return;
                const sentence = sentences[index++].trim();
                if (!sentence) {
                    speakNext();
                    return;
                }

                const utterance = new SpeechSynthesisUtterance(sentence);
                utterance.rate = 0.98; // Natural, calm cadence
                utterance.pitch = 1.05; // Friendly tone
                utterance.lang = 'en-US';
                if (preferredVoice) utterance.voice = preferredVoice;

                utterance.onend = () => speakNext();
                utterance.onerror = () => speakNext();

                this.activeUtterance = utterance;
                window.speechSynthesis.speak(utterance);
            };

            speakNext();
        } catch (err) {
            console.error("Speech synthesis failed:", err);
        }
    }

    /**
     * Stop ongoing audio playback
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
