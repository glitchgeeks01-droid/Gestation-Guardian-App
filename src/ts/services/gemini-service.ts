/**
 * Gemini AI + WHO Maternal Brain Engine
 * Integrates Google Gemini API with WHO Maternal Health & Antenatal Care Guidelines,
 * enriched with live patient profile & vitals context.
 */

import { WHOApiClient, WHO_MATERNAL_GUIDELINES } from './who-data';
import { Store } from '../store/store';

export class GeminiAIService {
    private static API_KEY_STORAGE_KEY = 'gg_gemini_api_key';
    private static conversationHistory: Array<{ role: 'user' | 'model', parts: [{ text: string }] }> = [];

    /**
     * Get configured Gemini API Key from localStorage or global config
     */
    static getApiKey(): string {
        return localStorage.getItem(this.API_KEY_STORAGE_KEY) || (window as any).GEMINI_API_KEY || '';
    }

    /**
     * Set Gemini API Key
     */
    static setApiKey(key: string) {
        localStorage.setItem(this.API_KEY_STORAGE_KEY, key.trim());
    }

    /**
     * Clear history
     */
    static clearHistory() {
        this.conversationHistory = [];
    }

    /**
     * Generate Patient Context string for grounding
     */
    private static getPatientContext(): string {
        try {
            const profile = Store.getProfile();
            const bpLogs = Store.getBPLogs() || [];
            const vitals = Store.getVitals() || [];
            const latestBP = bpLogs.length > 0 ? bpLogs[bpLogs.length - 1] : null;

            let context = `### PATIENT PROFILE & HEALTH DATA:\n`;
            if (profile) {
                context += `- Name: ${profile.name || 'Expecting Mother'}\n`;
                if (profile.gestationalWeeks) context += `- Gestational Age: ${profile.gestationalWeeks} weeks (${profile.trimester || 'Current'} trimester)\n`;
                if (profile.bloodGroup) context += `- Blood Group: ${profile.bloodGroup}\n`;
                if (profile.gestosisScore !== undefined) context += `- Gestosis Risk Score: ${profile.gestosisScore} (${profile.riskTier || 'Standard'})\n`;
            }
            if (latestBP) {
                context += `- Latest Blood Pressure: ${latestBP.systolic}/${latestBP.diastolic} mmHg (Logged: ${latestBP.date || 'Recent'})\n`;
            }
            if (vitals.length > 0) {
                const latestVital = vitals[vitals.length - 1];
                if (latestVital.weight) context += `- Current Weight: ${latestVital.weight} kg\n`;
                if (latestVital.bloodGlucose) context += `- Blood Glucose: ${latestVital.bloodGlucose} mg/dL\n`;
            }
            return context;
        } catch (e) {
            return `### PATIENT: Expecting Mother\n`;
        }
    }

    /**
     * Generate response using Gemini API or WHO Clinical Engine Fallback
     */
    static async generateResponse(userPrompt: string): Promise<string> {
        const apiKey = this.getApiKey();
        const whoContext = WHOApiClient.getWHOSystemPromptContext();
        const patientContext = this.getPatientContext();

        const systemInstruction = `You are "Gestation AI", a warm, highly empathetic, and clinically rigorous AI voice assistant designed specifically for pregnant women in the Gestation Guardian application.

Your knowledge base and clinical recommendations are strictly trained on and aligned with the World Health Organization (WHO) Antenatal Care (ANC) Guidelines, Pre-eclampsia management protocols, and Maternal Health standards.

${whoContext}

${patientContext}

GUIDELINES FOR YOUR RESPONSE:
1. Always maintain a calm, supportive, reassuring, and compassionate tone.
2. Directly answer the mother's question using World Health Organization (WHO) clinical recommendations.
3. If blood pressure or danger signs (severe headaches, visual flashes, swelling, chest pain, decreased fetal movement, vaginal bleeding) are mentioned, provide immediate, calm emergency triage advice to seek emergency obstetric care.
4. Keep spoken responses clear, engaging, and easy to understand (avoid overly dense medical jargon).
5. Always remind mothers to consult their obstetrician or midwife for diagnostic confirmation.`;

        // If Gemini API Key is available and online, call Gemini API
        if (apiKey && navigator.onLine) {
            try {
                const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
                
                // Add user message to history
                this.conversationHistory.push({
                    role: 'user',
                    parts: [{ text: userPrompt }]
                });

                // Keep last 10 messages for context
                if (this.conversationHistory.length > 10) {
                    this.conversationHistory = this.conversationHistory.slice(-10);
                }

                const payload = {
                    systemInstruction: {
                        parts: [{ text: systemInstruction }]
                    },
                    contents: this.conversationHistory,
                    generationConfig: {
                        temperature: 0.4,
                        maxOutputTokens: 800
                    }
                };

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const data = await response.json();
                    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (aiText) {
                        this.conversationHistory.push({
                            role: 'model',
                            parts: [{ text: aiText }]
                        });
                        return aiText;
                    }
                } else {
                    console.warn("Gemini API error, falling back to WHO Expert Knowledge Engine:", await response.text());
                }
            } catch (err) {
                console.warn("Gemini fetch error, using WHO Expert Knowledge Engine:", err);
            }
        }

        // Offline / No-API-Key fallback: WHO Expert Knowledge Engine
        return this.offlineWHOExpertEngine(userPrompt);
    }

    /**
     * Offline WHO Clinical Rule & Knowledge Engine
     */
    private static offlineWHOExpertEngine(query: string): Promise<string> {
        const text = query.toLowerCase();

        return new Promise((resolve) => {
            setTimeout(() => {
                // Danger signs check
                if (text.includes('bleed') || text.includes('spotting') || text.includes('severe pain') || text.includes('water broke') || text.includes('fluid leak')) {
                    resolve("⚠️ **WHO Emergency Alert**: Vaginal bleeding, fluid leakage, or severe abdominal pain are maternal danger signs. Please contact your doctor, midwife, or visit the nearest maternity emergency center immediately. Rest on your left side and avoid strenuous activity while getting medical care.");
                    return;
                }

                // High BP / Preeclampsia
                if (text.includes('bp') || text.includes('blood pressure') || text.includes('headache') || text.includes('blurry') || text.includes('swelling') || text.includes('preeclampsia')) {
                    resolve("🩺 **WHO Pre-eclampsia Protocol**: The World Health Organization recommends close monitoring of blood pressure during pregnancy. A reading of 140/90 mmHg or higher requires clinical evaluation. If you experience severe headaches, blurred vision, or sudden facial swelling, contact your healthcare provider right away.");
                    return;
                }

                // Iron, Nutrition & Diet
                if (text.includes('iron') || text.includes('food') || text.includes('diet') || text.includes('eat') || text.includes('calcium') || text.includes('supplement') || text.includes('nutrition')) {
                    resolve("🥗 **WHO Maternal Nutrition Guidance**: WHO recommends daily supplementation of 30-60 mg elemental iron and 400 µg folic acid to prevent maternal anemia and support healthy fetal growth. Include leafy greens, lentils, lean proteins, and citrus fruits (vitamin C aids iron absorption). Stay hydrated with 2 to 2.5 liters of water daily!");
                    return;
                }

                // Fetal Movement & Kick Counts
                if (text.includes('kick') || text.includes('movement') || text.includes('moving') || text.includes('baby move')) {
                    resolve("👶 **WHO Fetal Well-being Standard**: From the late second and third trimester, expect at least 10 distinct movements or kicks within a 2-hour window when resting on your left side after a meal. If you notice a significant decrease or absence in movement, contact your healthcare provider promptly.");
                    return;
                }

                // Contractions & Labor
                if (text.includes('contraction') || text.includes('labor') || text.includes('pain') || text.includes('delivery')) {
                    resolve("⏱️ **WHO Labor & Contraction Care**: Braxton Hicks practice contractions are irregular and subside with rest. If contractions become regular every 5 minutes, last 60 seconds, and continue for over an hour (the 5-1-1 rule), or if you are before 37 weeks, contact your delivery hospital.");
                    return;
                }

                // Sleep & Posture
                if (text.includes('sleep') || text.includes('position') || text.includes('lying down')) {
                    resolve("🛌 **WHO Care Advice**: Sleeping on your left side is optimal, particularly in the second and third trimesters. This position optimizes blood and nutrient flow to the placenta and prevents compression of the inferior vena cava.");
                    return;
                }

                // Nausea / Morning sickness
                if (text.includes('nausea') || text.includes('vomit') || text.includes('morning sickness')) {
                    resolve("🍵 **WHO Antenatal Care Advice**: For morning sickness, eat small, frequent meals rich in complex carbohydrates (like crackers or toast before rising), stay hydrated with small sips of water, and consider ginger or vitamin B6 under doctor guidance.");
                    return;
                }

                // Default WHO General Antenatal Guidance
                resolve("🤰 **Gestation AI (WHO Guidelines)**: According to World Health Organization (WHO) Antenatal Care guidelines, maintaining regular prenatal visits, taking daily iron and folic acid supplements, tracking blood pressure, and staying hydrated are essential for you and your baby. If you have specific symptoms, feel free to ask me!");
            }, 300);
        });
    }
}
