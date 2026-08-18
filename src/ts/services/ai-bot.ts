// @ts-nocheck
// js/ai-bot.ts

import { GeminiAIService } from './gemini-service';
import { VoiceAssistant } from './voice-service';

export const AIBot = {
    init() {
        this.setupDraggableFab();
        this.setupChatUI();
        VoiceAssistant.init();
    },

    setupDraggableFab() {
        if ((window as any)._aiFabListenersBound) return;
        (window as any)._aiFabListenersBound = true;
        
        const fab = document.getElementById('ai-bot-fab');
        const overlay = document.getElementById('ai-chat-overlay');
        if (!fab || !overlay) return;

        let isDragging = false;
        let startY = 0;
        let startX = 0;
        let initialY = 0;
        let initialX = 0;
        let hasMoved = false;

        // Touch Events
        fab.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startY = touch.clientY;
            startX = touch.clientX;
            
            const transform = window.getComputedStyle(fab).transform;
            let currentX = 0;
            let currentY = 0;
            if (transform !== 'none') {
                const matrix = new DOMMatrix(transform);
                currentX = matrix.m41;
                currentY = matrix.m42;
            }
            initialX = currentX;
            initialY = currentY;
            hasMoved = false;
            
            fab.style.transition = 'none';
        }, { passive: true });

        fab.addEventListener('touchmove', (e) => {
            isDragging = true;
            const touch = e.touches[0];
            const deltaY = touch.clientY - startY;
            const deltaX = touch.clientX - startX;
            
            if (Math.abs(deltaY) > 15 || Math.abs(deltaX) > 15) {
                hasMoved = true;
            }

            const newY = initialY + deltaY;
            const newX = initialX + deltaX;

            fab.style.transform = `translate(${newX}px, ${newY}px) scale(1.05)`;
        }, { passive: true });

        fab.addEventListener('touchend', (e) => {
            isDragging = false;
            fab.style.transition = 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)';
            
            if (hasMoved) {
                const transform = window.getComputedStyle(fab).transform;
                if (transform !== 'none') {
                    const matrix = new DOMMatrix(transform);
                    fab.style.transform = `translate(${matrix.m41}px, ${matrix.m42}px) scale(1)`;
                }
            } else {
                fab.style.transform = `translate(${initialX}px, ${initialY}px) scale(1)`;
                this.openChat();
            }
        });

        // Mouse Events
        fab.addEventListener('mousedown', (e) => {
            isDragging = true;
            hasMoved = false;
            startY = e.clientY;
            startX = e.clientX;
            
            const transform = window.getComputedStyle(fab).transform;
            let currentX = 0;
            let currentY = 0;
            if (transform !== 'none') {
                const matrix = new DOMMatrix(transform);
                currentX = matrix.m41;
                currentY = matrix.m42;
            }
            initialX = currentX;
            initialY = currentY;
            
            fab.style.transition = 'none';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaY = e.clientY - startY;
            const deltaX = e.clientX - startX;
            if (Math.abs(deltaY) > 5 || Math.abs(deltaX) > 5) hasMoved = true;
            fab.style.transform = `translate(${initialX + deltaX}px, ${initialY + deltaY}px) scale(1.05)`;
        });

        window.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            fab.style.transition = 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)';
            if (!hasMoved) {
                fab.style.transform = `translate(${initialX}px, ${initialY}px) scale(1)`;
                this.openChat();
            } else {
                const transform = window.getComputedStyle(fab).transform;
                if (transform !== 'none') {
                    const matrix = new DOMMatrix(transform);
                    fab.style.transform = `translate(${matrix.m41}px, ${matrix.m42}px) scale(1)`;
                }
            }
        });
        
        fab.addEventListener('click', () => {
            if (!hasMoved) {
                this.openChat();
            }
        });
    },

    setupChatUI() {
        const closeBtn = document.getElementById('close-ai-chat');
        const overlay = document.getElementById('ai-chat-overlay');
        const form = document.getElementById('global-chat-form');
        const micBtn = document.getElementById('ai-mic-btn');
        const ttsToggle = document.getElementById('ai-tts-toggle');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeChat();
                VoiceAssistant.stopSpeaking();
                VoiceAssistant.stopListening();
            });
        }
        
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeChat();
                    VoiceAssistant.stopSpeaking();
                    VoiceAssistant.stopListening();
                }
            });
        }

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendMessage();
            });
        }
        
        const input = document.getElementById('global-chat-input');
        if (input) {
            input.addEventListener('keydown', (e: KeyboardEvent) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Setup Mic button for Voice Speech-to-Text
        if (micBtn) {
            micBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleVoiceInput();
            });
        }

        // Setup TTS Audio playback toggle
        if (ttsToggle) {
            ttsToggle.addEventListener('click', () => {
                const isEnabled = VoiceAssistant.toggleTTS();
                ttsToggle.innerHTML = isEnabled 
                    ? `<i data-lucide="volume-2" style="width: 18px; height: 18px;"></i>` 
                    : `<i data-lucide="volume-x" style="width: 18px; height: 18px;"></i>`;
                if ((window as any).lucide) (window as any).lucide.createIcons({ root: ttsToggle });
            });
        }
    },

    toggleVoiceInput() {
        const micBtn = document.getElementById('ai-mic-btn');
        const input = document.getElementById('global-chat-input') as HTMLTextAreaElement;

        VoiceAssistant.startListening(
            (transcript, isFinal) => {
                if (input) {
                    input.value = transcript;
                    input.style.height = '';
                    input.style.height = input.scrollHeight + 'px';
                }
                if (isFinal) {
                    setTimeout(() => {
                        this.sendMessage();
                    }, 400);
                }
            },
            (isListening) => {
                if (micBtn) {
                    if (isListening) {
                        micBtn.style.background = "#FF2E63";
                        micBtn.style.color = "white";
                        micBtn.classList.add("pulse-animation");
                    } else {
                        micBtn.style.background = "var(--clr-bg-card, #f0f4f0)";
                        micBtn.style.color = "var(--clr-primary, #6DA171)";
                        micBtn.classList.remove("pulse-animation");
                    }
                }
            }
        );
    },

    openChat() {
        const overlay = document.getElementById('ai-chat-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    },

    closeChat() {
        const overlay = document.getElementById('ai-chat-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    },

    async sendMessage() {
        const input = document.getElementById('global-chat-input') as HTMLTextAreaElement;
        const text = input.value.trim();
        if (!text) return;
        
        const history = document.getElementById('global-chat-history');
        if (!history) return;
        
        // Add user message
        const userMsg = document.createElement('div');
        userMsg.style.display = "flex";
        userMsg.style.gap = "12px";
        userMsg.style.alignItems = "flex-start";
        userMsg.style.maxWidth = "85%";
        userMsg.style.alignSelf = "flex-end";
        userMsg.style.flexDirection = "row-reverse";
        userMsg.innerHTML = `
            <div style="width: 32px; height: 32px; background: var(--clr-bg-card, #f0f4f0); color: var(--clr-primary, #6DA171); border-radius: 50%; display: flex; justify-content: center; align-items: center; flex-shrink: 0; border: 1px solid var(--clr-divider, #e0e0e0);">
                <i data-lucide="user" style="width: 16px; height: 16px;"></i>
            </div>
            <div style="background: var(--clr-primary, #6DA171); padding: 14px 18px; border-radius: 20px 4px 20px 20px; box-shadow: var(--shadow-sm, 0 2px 4px rgba(0,0,0,0.05));">
                <p style="font-size: 14px; color: white; line-height: 1.5; margin: 0;">
                    ${text.replace(/</g, "&lt;")}
                </p>
            </div>
        `;
        history.appendChild(userMsg);
        
        input.value = '';
        input.style.height = '48px';
        
        if ((window as any).lucide) {
            (window as any).lucide.createIcons({ root: userMsg });
        }
        
        history.scrollTop = history.scrollHeight;
        
        // Show typing indicator
        const typingId = `ai-typing-${Date.now()}`;
        const typingMsg = document.createElement('div');
        typingMsg.id = typingId;
        typingMsg.style.display = "flex";
        typingMsg.style.gap = "12px";
        typingMsg.style.alignItems = "flex-start";
        typingMsg.style.maxWidth = "85%";
        typingMsg.innerHTML = `
            <div style="width: 32px; height: 32px; background: #E8547A; color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; flex-shrink: 0;">
                <i data-lucide="bot" style="width: 16px; height: 16px;"></i>
            </div>
            <div style="background: white; padding: 14px 18px; border-radius: 4px 20px 20px 20px; box-shadow: var(--shadow-sm); border: 1px solid var(--clr-divider, #eee);">
                <p style="font-size: 14px; color: var(--clr-text-body, #666); line-height: 1.5; font-style: italic; margin: 0; display: flex; align-items: center; gap: 6px;">
                    <span>Consulting WHO Guidelines & Gemini</span>
                    <span class="dot-typing">...</span>
                </p>
            </div>
        `;
        history.appendChild(typingMsg);
        if ((window as any).lucide) {
            (window as any).lucide.createIcons({ root: typingMsg });
        }
        history.scrollTop = history.scrollHeight;

        try {
            const response = await GeminiAIService.generateResponse(text);
            
            // Remove typing indicator
            const indicator = document.getElementById(typingId);
            if (indicator) indicator.remove();

            // Format markdown headers, bold, bullets
            const formattedResponse = response
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n\n/g, '<br><br>')
                .replace(/\n- /g, '<br>• ');

            const aiMsg = document.createElement('div');
            aiMsg.style.display = "flex";
            aiMsg.style.gap = "12px";
            aiMsg.style.alignItems = "flex-start";
            aiMsg.style.maxWidth = "85%";
            
            aiMsg.innerHTML = `
                <div style="width: 32px; height: 32px; background: #E8547A; color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; flex-shrink: 0;">
                    <i data-lucide="bot" style="width: 16px; height: 16px;"></i>
                </div>
                <div style="background: white; padding: 14px 18px; border-radius: 4px 20px 20px 20px; box-shadow: var(--shadow-sm); border: 1px solid var(--clr-divider, #eee);">
                    <div style="font-size: 14px; color: var(--clr-text-body, #333); line-height: 1.55;">
                        ${formattedResponse}
                    </div>
                    <div style="margin-top: 8px; display: flex; justify-content: flex-end; gap: 8px;">
                        <button class="ai-speak-btn" style="background: transparent; border: none; cursor: pointer; color: var(--clr-text-muted, #888); padding: 4px;" title="Listen to response">
                            <i data-lucide="volume-2" style="width: 16px; height: 16px;"></i>
                        </button>
                    </div>
                </div>
            `;
            history.appendChild(aiMsg);

            // Add speak button listener for this specific message
            const speakBtn = aiMsg.querySelector('.ai-speak-btn');
            if (speakBtn) {
                speakBtn.addEventListener('click', () => {
                    VoiceAssistant.speak(response);
                });
            }

            if ((window as any).lucide) {
                (window as any).lucide.createIcons({ root: aiMsg });
            }
            history.scrollTop = history.scrollHeight;

            // Automatically speak response if TTS is active
            VoiceAssistant.speak(response);
        } catch (error) {
            console.error("AI query failed:", error);
            const indicator = document.getElementById(typingId);
            if (indicator) indicator.remove();
        }
    }
};

(window as any).AIBot = AIBot;
