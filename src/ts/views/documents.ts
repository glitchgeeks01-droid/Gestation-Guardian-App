// @ts-nocheck
import { SecureStore } from '../core/secure_store';
import { UI } from '../components/ui';

export interface DocumentItem {
    id: string;
    name: string;
    category: string;
    size: number;
    mimeType: string;
    uploadedAt: string;
    dataUrl: string;
    encryptedBadge: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const DocumentsView = {
    async init() {
        const fileInput = document.getElementById('document-file-input') as HTMLInputElement;
        const browseBtn = document.getElementById('btn-browse-files');
        const dropzone = document.getElementById('document-dropzone');

        if (browseBtn && fileInput) {
            browseBtn.onclick = (e) => {
                e.stopPropagation();
                fileInput.click();
            };
        }

        if (dropzone && fileInput) {
            dropzone.onclick = () => fileInput.click();

            dropzone.ondragover = (e) => {
                e.preventDefault();
                dropzone.style.borderColor = 'var(--clr-dark-green)';
            };

            dropzone.ondragleave = () => {
                dropzone.style.borderColor = 'var(--clr-primary)';
            };

            dropzone.ondrop = (e) => {
                e.preventDefault();
                dropzone.style.borderColor = 'var(--clr-primary)';
                if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    this.handleFileSelected(e.dataTransfer.files[0]);
                }
            };
        }

        if (fileInput) {
            fileInput.onchange = () => {
                if (fileInput.files && fileInput.files.length > 0) {
                    this.handleFileSelected(fileInput.files[0]);
                    fileInput.value = ''; // Reset input
                }
            };
        }

        await this.renderDocumentList();
    },

    /**
     * Inspect file header magic bytes to prevent MIME-type spoofing
     */
    async inspectMagicBytes(file: File): Promise<{ isValid: boolean; detectedType: string }> {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const buffer = e.target?.result as ArrayBuffer;
                if (!buffer || buffer.byteLength < 4) {
                    return resolve({ isValid: false, detectedType: 'Unknown / Corrupted' });
                }

                const bytes = new Uint8Array(buffer.slice(0, 8));

                // PDF magic bytes: 0x25, 0x50, 0x44, 0x46 (%PDF)
                if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
                    return resolve({ isValid: true, detectedType: 'application/pdf' });
                }

                // PNG magic bytes: 0x89, 0x50, 0x4E, 0x47 (‰PNG)
                if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
                    return resolve({ isValid: true, detectedType: 'image/png' });
                }

                // JPEG magic bytes: 0xFF, 0xD8, 0xFF
                if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
                    return resolve({ isValid: true, detectedType: 'image/jpeg' });
                }

                return resolve({ isValid: false, detectedType: 'Unrecognized / Disallowed binary structure' });
            };
            reader.onerror = () => resolve({ isValid: false, detectedType: 'Read Error' });
            reader.readAsArrayBuffer(file.slice(0, 16));
        });
    },

    async handleFileSelected(file: File) {
        const banner = document.getElementById('upload-status-banner');
        const showStatus = (msg: string, isError = false) => {
            if (banner) {
                banner.style.display = 'flex';
                banner.style.background = isError ? '#FEE2E2' : '#DCFCE7';
                banner.style.color = isError ? '#991B1B' : '#166534';
                banner.style.border = isError ? '1px solid #FCA5A5' : '1px solid #86EFAC';
                banner.textContent = msg;
            }
            if (isError) {
                UI.showToast(msg, 'error');
            }
        };

        // 1. File size check (<= 10MB)
        if (file.size > MAX_FILE_SIZE) {
            showStatus(`File exceeds maximum limit of 10 MB (Selected: ${(file.size / (1024 * 1024)).toFixed(1)} MB).`, true);
            return;
        }

        // 2. Client-side Magic-Byte validation
        const { isValid, detectedType } = await this.inspectMagicBytes(file);
        if (!isValid) {
            showStatus(`Security Validation Failed: Invalid magic bytes (${detectedType}). Allowed formats: PDF, PNG, JPEG.`, true);
            return;
        }

        // 3. Read content into DataURL
        const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });

        // 4. Build Document Item
        const categorySelect = document.getElementById('doc-category-select') as HTMLSelectElement;
        const titleInput = document.getElementById('doc-title-input') as HTMLInputElement;

        const category = categorySelect ? categorySelect.value : 'Ultrasound Scan';
        const customTitle = titleInput?.value?.trim();
        const docName = customTitle || file.name;

        const newDoc: DocumentItem = {
            id: 'doc_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            name: docName,
            category: category,
            size: file.size,
            mimeType: detectedType,
            uploadedAt: new Date().toISOString(),
            dataUrl: dataUrl,
            encryptedBadge: 'AES-256-GCM Encrypted'
        };

        // 5. Store in SecureStore (AES-GCM encrypted)
        const docs = await SecureStore.getSecureItem<DocumentItem[]>('gg_documents') || [];
        docs.unshift(newDoc);
        await SecureStore.setSecureItem('gg_documents', docs);

        if (titleInput) titleInput.value = '';
        showStatus(`Successfully encrypted and vaulted "${docName}" (${(file.size / 1024).toFixed(0)} KB)`, false);
        UI.showToast('Document securely uploaded', 'success');

        await this.renderDocumentList();
    },

    async renderDocumentList() {
        const container = document.getElementById('documents-list-container');
        const countSpan = document.getElementById('documents-count');
        const emptyState = document.getElementById('documents-empty-state');
        if (!container) return;

        const docs = await SecureStore.getSecureItem<DocumentItem[]>('gg_documents') || [];
        if (countSpan) countSpan.textContent = String(docs.length);

        if (docs.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        // Clear existing dynamic cards (keep empty state hidden)
        const oldCards = container.querySelectorAll('.doc-item-card');
        oldCards.forEach(c => c.remove());

        docs.forEach(doc => {
            const card = document.createElement('div');
            card.className = 'card-white doc-item-card';
            card.style.display = 'flex';
            card.style.justifyContent = 'space-between';
            card.style.alignItems = 'center';
            card.style.padding = '16px';
            card.style.gap = '12px';

            const formattedDate = new Date(doc.uploadedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });

            const isPdf = doc.mimeType === 'application/pdf';
            const iconName = isPdf ? 'file-text' : 'image';

            card.innerHTML = `
                <div style="display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0;">
                    <div style="width: 42px; height: 42px; border-radius: 12px; background: var(--clr-green-10); color: var(--clr-primary); display: flex; justify-content: center; align-items: center; flex-shrink: 0;">
                        <i data-lucide="${iconName}" style="width: 22px; height: 22px;"></i>
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <h4 style="font-size: 14px; font-weight: 700; color: var(--clr-text-heading); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                ${doc.name}
                            </h4>
                        </div>
                        <p style="font-size: 12px; color: var(--clr-text-muted); margin: 2px 0 4px;">
                            ${doc.category} • ${(doc.size / 1024).toFixed(0)} KB • ${formattedDate}
                        </p>
                        <span style="display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; color: var(--clr-primary); background: var(--clr-green-10); padding: 2px 6px; border-radius: 4px;">
                            🔒 ${doc.encryptedBadge}
                        </span>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <a href="${doc.dataUrl}" download="${doc.name}" target="_blank" class="btn btn-secondary" style="padding: 8px 12px; font-size: 12px; text-decoration: none; display: flex; align-items: center; gap: 4px;" title="Signed View Link">
                        <i data-lucide="eye" style="width: 14px; height: 14px;"></i> View
                    </a>
                    <button class="btn-text btn-delete-doc" data-id="${doc.id}" style="color: #DC2626; padding: 6px;" title="Delete Document">
                        <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
                    </button>
                </div>
            `;

            container.appendChild(card);
        });

        // Attach delete handlers
        container.querySelectorAll('.btn-delete-doc').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                if (!id) return;
                let current = await SecureStore.getSecureItem<DocumentItem[]>('gg_documents') || [];
                current = current.filter(d => d.id !== id);
                await SecureStore.setSecureItem('gg_documents', current);
                UI.showToast('Document removed', 'info');
                await this.renderDocumentList();
            });
        });

        if ((window as any).lucide) {
            (window as any).lucide.createIcons({ root: container });
        }
    }
};

// Global hook
if (typeof window !== 'undefined') {
    (window as any).DocumentsView = DocumentsView;
}
