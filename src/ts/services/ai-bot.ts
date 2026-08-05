// @ts-nocheck
// js/ai-bot.ts

import { queryAI } from './mock-ai';

export const AIBot = {
    init() {
        this.setupDraggableFab();
        this.setupChatUI();
    },

    setupDraggableFab() {
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
            
            // Get current transform translate values if any, else default to 0
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
            
            fab.style.transition = 'none'; // Disable transition for smooth dragging
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
                // Snap back to normal scale, keep position
                const transform = window.getComputedStyle(fab).transform;
                if (transform !== 'none') {
                    const matrix = new DOMMatrix(transform);
                    fab.style.transform = `translate(${matrix.m41}px, ${matrix.m42}px) scale(1)`;
                }
            } else {
                // It was a tap! Open the chat overlay
                fab.style.transform = `translate(${initialX}px, ${initialY}px) scale(1)`;
                this.openChat();
            }
        });

        // Mouse Events (for testing in browser)
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
        
        // Universal click listener (handles taps natively on all platforms)
        fab.addEventListener('click', (e) => {
            if (!hasMoved) {
                this.openChat();
            }
        });
    },

    setupChatUI() {
        const closeBtn = document.getElementById('close-ai-chat');
        const overlay = document.getElementById('ai-chat-overlay');
        const form = document.getElementById('global-chat-form');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeChat();
            });
        }
        
        if (overlay) {
            // Close on click outside sheet
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) this.closeChat();
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
            <div style="width: 32px; height: 32px; background: var(--clr-bg-card); color: var(--clr-primary); border-radius: 50%; display: flex; justify-content: center; align-items: center; flex-shrink: 0; border: 1px solid var(--clr-divider);">
                <i data-lucide="user" style="width: 16px; height: 16px;"></i>
            </div>
            <div style="background: var(--clr-primary); padding: 16px; border-radius: 20px 4px 20px 20px; box-shadow: var(--shadow-sm);">
                <p style="font-size: 14px; color: white; line-height: 1.5;">
                    ${text.replace(/</g, "&lt;")}
                </p>
            </div>
        `;
        history.appendChild(userMsg);
        
        input.value = '';
        input.style.height = '48px';
        
        if ((window as any).lucide) {
            (window as any).lucide.createIcons({root: userMsg});
        }
        
        history.scrollTop = history.scrollHeight;
        
        // Show typing indicator
        const typingMsg = document.createElement('div');
        typingMsg.style.display = "flex";
        typingMsg.style.gap = "12px";
        typingMsg.style.alignItems = "flex-start";
        typingMsg.style.maxWidth = "85%";
        typingMsg.id = "ai-typing-indicator";
        typingMsg.innerHTML = `
            <div style="width: 32px; height: 32px; background: #E8547A; color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; flex-shrink: 0;">
                <i data-lucide="bot" style="width: 16px; height: 16px;"></i>
            </div>
            <div style="background: white; padding: 16px; border-radius: 4px 20px 20px 20px; box-shadow: var(--shadow-sm); border: 1px solid var(--clr-divider);">
                <p style="font-size: 14px; color: var(--clr-text-body); line-height: 1.5; font-style: italic;">
                    Typing...
                </p>
            </div>
        `;
        history.appendChild(typingMsg);
        if ((window as any).lucide) {
            (window as any).lucide.createIcons({root: typingMsg});
        }
        history.scrollTop = history.scrollHeight;

        try {
            const response = await queryAI(text);
            
            // Remove typing indicator
            const indicator = document.getElementById('ai-typing-indicator');
            if (indicator) indicator.remove();

            const aiMsg = document.createElement('div');
            aiMsg.style.display = "flex";
            aiMsg.style.gap = "12px";
            aiMsg.style.alignItems = "flex-start";
            aiMsg.style.maxWidth = "85%";
            
            aiMsg.innerHTML = `
                <div style="width: 32px; height: 32px; background: #E8547A; color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; flex-shrink: 0;">
                    <i data-lucide="bot" style="width: 16px; height: 16px;"></i>
                </div>
                <div style="background: white; padding: 16px; border-radius: 4px 20px 20px 20px; box-shadow: var(--shadow-sm); border: 1px solid var(--clr-divider);">
                    <p style="font-size: 14px; color: var(--clr-text-body); line-height: 1.5;">
                        ${response}
                    </p>
                </div>
            `;
            history.appendChild(aiMsg);
            if ((window as any).lucide) {
                (window as any).lucide.createIcons({root: aiMsg});
            }
            history.scrollTop = history.scrollHeight;
        } catch (error) {
            console.error("AI query failed:", error);
            const indicator = document.getElementById('ai-typing-indicator');
            if (indicator) indicator.remove();
        }
    }
};

(window as any).AIBot = AIBot;
