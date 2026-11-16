/**
 * Deterministic salted SHA-256 password hashing utility
 * Uses Web Crypto API when available with pure-JS fallback
 */

export const PASSWORD_SALT = 'gg_gestation_guardian_salt_2026_';

function utf8Encode(str: string): number[] {
    const bytes: number[] = [];
    for (let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i);
        if (code < 0x80) {
            bytes.push(code);
        } else if (code < 0x800) {
            bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
        } else if (code < 0xd800 || code >= 0xe000) {
            bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
        } else {
            i++;
            code = 0x10000 + (((code & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
            bytes.push(
                0xf0 | (code >> 18),
                0x80 | ((code >> 12) & 0x3f),
                0x80 | ((code >> 6) & 0x3f),
                0x80 | (code & 0x3f)
            );
        }
    }
    return bytes;
}

function sha256Bytes(bytes: number[] | Uint8Array): string {
    const K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    let H0 = 0x6a09e667;
    let H1 = 0xbb67ae85;
    let H2 = 0x3c6ef372;
    let H3 = 0xa54ff53a;
    let H4 = 0x510e527f;
    let H5 = 0x9b05688c;
    let H6 = 0x1f83d9ab;
    let H7 = 0x5be0cd19;

    const byteLen = bytes.length;
    const bitLen = byteLen * 8;

    const extra = (byteLen + 9) % 64;
    const padLen = extra === 0 ? 0 : 64 - extra;
    const totalLen = byteLen + 1 + padLen + 8;
    const padded = new Uint8Array(totalLen);
    padded.set(bytes);
    padded[byteLen] = 0x80;

    const highBits = Math.floor(bitLen / 0x100000000);
    const lowBits = bitLen >>> 0;
    const view = new DataView(padded.buffer);
    view.setUint32(totalLen - 8, highBits, false);
    view.setUint32(totalLen - 4, lowBits, false);

    const w = new Uint32Array(64);
    const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n));

    for (let i = 0; i < totalLen; i += 64) {
        for (let t = 0; t < 16; t++) {
            w[t] = view.getUint32(i + t * 4, false);
        }
        for (let t = 16; t < 64; t++) {
            const s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ (w[t - 15] >>> 3);
            const s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ (w[t - 2] >>> 10);
            w[t] = (w[t - 16] + s0 + w[t - 7] + s1) >>> 0;
        }

        let a = H0;
        let b = H1;
        let c = H2;
        let d = H3;
        let e = H4;
        let f = H5;
        let g = H6;
        let h = H7;

        for (let t = 0; t < 64; t++) {
            const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
            const ch = (e & f) ^ ((~e) & g);
            const temp1 = (h + S1 + ch + K[t] + w[t]) >>> 0;
            const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const temp2 = (S0 + maj) >>> 0;

            h = g;
            g = f;
            f = e;
            e = (d + temp1) >>> 0;
            d = c;
            c = b;
            b = a;
            a = (temp1 + temp2) >>> 0;
        }

        H0 = (H0 + a) >>> 0;
        H1 = (H1 + b) >>> 0;
        H2 = (H2 + c) >>> 0;
        H3 = (H3 + d) >>> 0;
        H4 = (H4 + e) >>> 0;
        H5 = (H5 + f) >>> 0;
        H6 = (H6 + g) >>> 0;
        H7 = (H7 + h) >>> 0;
    }

    const toHex = (n: number) => n.toString(16).padStart(8, '0');
    return `${toHex(H0)}${toHex(H1)}${toHex(H2)}${toHex(H3)}${toHex(H4)}${toHex(H5)}${toHex(H6)}${toHex(H7)}`;
}

export function sha256Fallback(saltedText: string): string {
    const bytes = typeof TextEncoder !== 'undefined'
        ? new TextEncoder().encode(saltedText)
        : new Uint8Array(utf8Encode(saltedText));
    return sha256Bytes(bytes);
}

/**
 * Deterministic salted SHA-256 password hashing.
 * Salt: 'gg_gestation_guardian_salt_2026_' + password
 */
export async function hashPassword(password: string): Promise<string> {
    const salted = PASSWORD_SALT + password;

    try {
        const cryptoObj = typeof window !== 'undefined' ? window.crypto : (typeof crypto !== 'undefined' ? crypto : null);
        if (cryptoObj?.subtle?.digest) {
            const encoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : null;
            const data = encoder ? encoder.encode(salted) : new Uint8Array(utf8Encode(salted));
            const hashBuffer = await cryptoObj.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }
    } catch (e) {
        console.warn('SubtleCrypto digest failed, falling back to pure-JS SHA-256', e);
    }

    return sha256Fallback(salted);
}
