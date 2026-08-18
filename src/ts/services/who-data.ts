/**
 * WHO (World Health Organization) Maternal & Antenatal Care Data Engine
 * Includes WHO Antenatal Care (ANC) Guidelines, Pre-eclampsia protocols,
 * Maternal Nutrition, and WHO GHO (Global Health Observatory) API Connector.
 */

export interface WHOGuideline {
    topic: string;
    category: 'preeclampsia' | 'nutrition' | 'danger_signs' | 'fetal_monitoring' | 'labor' | 'general';
    recommendation: string;
    whoSource: string;
    keyPoints: string[];
}

export const WHO_MATERNAL_GUIDELINES: WHOGuideline[] = [
    {
        topic: "Hypertension & Pre-eclampsia Prevention & Management",
        category: "preeclampsia",
        recommendation: "WHO recommends screening blood pressure at every antenatal contact. Women at high risk of pre-eclampsia should receive daily low-dose aspirin (75-150 mg) starting before 20 weeks of gestation, and calcium supplementation (1.5-2.0 g/day) in areas with low dietary calcium intake.",
        whoSource: "WHO recommendations on drug interventions for non-communicable diseases in pregnancy (2020) & Pre-eclampsia/Eclampsia guidelines",
        keyPoints: [
            "Normal BP: < 120/80 mmHg",
            "Gestational Hypertension: Systolic >= 140 mmHg or Diastolic >= 90 mmHg on two occasions at least 4 hours apart after 20 weeks",
            "Severe Pre-eclampsia: Systolic >= 160 mmHg or Diastolic >= 110 mmHg, requiring urgent clinical evaluation",
            "Red Flag Symptoms: Persistent severe headache, visual disturbances (blurring, flashing lights), severe upper right abdominal pain, sudden severe facial/hand swelling, shortness of breath",
            "First-line severe hypertension management: Oral labetalol, hydralazine, or nifedipine under physician care"
        ]
    },
    {
        topic: "Antenatal Care (ANC) Model & Contact Schedule",
        category: "general",
        recommendation: "WHO recommends a minimum of 8 antenatal contacts to reduce perinatal mortality and improve women's experience of care. The first contact should take place in the first trimester (up to 12 weeks).",
        whoSource: "WHO recommendations on antenatal care for a positive pregnancy experience (2016)",
        keyPoints: [
            "Contact 1: ~12 weeks (1st Trimester screening, blood tests, ultrasound)",
            "Contact 2: ~20 weeks (Anomaly ultrasound, fetal growth)",
            "Contact 3: ~26 weeks (Gestational diabetes screening, vitals check)",
            "Contact 4: ~30 weeks (Symptom & growth review)",
            "Contact 5: ~34 weeks (Pre-eclampsia & fetal presentation check)",
            "Contact 6: ~36 weeks (Position, BP, birth preparation)",
            "Contact 7: ~38 weeks (Birth plan & cervical readiness)",
            "Contact 8: ~40 weeks (Post-date review & fetal movements)"
        ]
    },
    {
        topic: "Maternal Nutrition & Essential Supplementation",
        category: "nutrition",
        recommendation: "Daily oral iron (30-60 mg of elemental iron) and folic acid (400 μg) supplementation is recommended for all pregnant women to prevent maternal anemia, puerperal sepsis, low birth weight, and neural tube defects.",
        whoSource: "WHO Guideline: Daily iron and folic acid supplementation in pregnant women",
        keyPoints: [
            "Iron: 30-60 mg elemental iron daily + Vitamin C (citrus, berries) to optimize iron absorption",
            "Folic Acid: 400 mcg daily, ideally starting pre-conception through at least the first 12 weeks",
            "Dietary Energy & Protein: Diverse diet consisting of fresh vegetables, whole grains, legumes, dairy, and lean proteins",
            "Hydration: 8-10 glasses (2.0 - 2.5 Liters) of clean water daily",
            "Avoid: Unpasteurized dairy, raw or undercooked meats/eggs, excess caffeine (>200mg/day), alcohol, and tobacco"
        ]
    },
    {
        topic: "Fetal Movement & Kick Counting",
        category: "fetal_monitoring",
        recommendation: "Fetal movements are an indicator of fetal health and neural development. Mothers typically begin feeling movements between 16-24 weeks (quickening). Regular daily assessment is recommended in the 3rd trimester.",
        whoSource: "WHO Antenatal Care Guidelines - Fetal Well-being Assessment",
        keyPoints: [
            "Kick Count Standard: Expect at least 10 distinct movements (kicks, rolls, flutters) within 2 hours while in a relaxed, left-lateral position",
            "Best Time: After meals or in the evening when baby is naturally most active",
            "Action on Decreased Movement: If fewer than 10 kicks in 2 hours or a sudden cessation of usual activity patterns occurs, contact healthcare provider immediately for non-stress testing (NST)"
        ]
    },
    {
        topic: "Maternal Danger Signs (Seek Immediate Emergency Care)",
        category: "danger_signs",
        recommendation: "Health systems and caregivers must educate pregnant women on danger signs that necessitate emergency medical evaluation without delay.",
        whoSource: "WHO Managing Complications in Pregnancy and Childbirth (IMPAC)",
        keyPoints: [
            "Vaginal bleeding (any amount at any stage of pregnancy)",
            "Severe persistent headache or blurred/spotted vision",
            "Convulsions or loss of consciousness",
            "High fever with chills and weakness",
            "Severe abdominal pain or persistent vomiting",
            "Premature rupture of membranes (leaking watery fluid)",
            "Marked decrease or complete absence of fetal movements in 3rd trimester"
        ]
    },
    {
        topic: "Labor Contractions & Labor Signs",
        category: "labor",
        recommendation: "Distinguish between physiological Braxton Hicks contractions (irregular, painless or mild, subside with rest/hydration) and true labor contractions.",
        whoSource: "WHO intrapartum care for a positive childbirth experience (2018)",
        keyPoints: [
            "5-1-1 Rule for Active Labor: Contractions occur every 5 minutes, last for 1 full minute, continuing consistently for at least 1 hour",
            "Signs of True Labor: Regular intervals getting progressively closer, increasing intensity, accompanied by lower back pain, bloody show, or water breaking",
            "Immediate Hospital Contact: Contractions before 37 weeks (preterm labor), green/brown amniotic fluid, or continuous agonizing uterine pain"
        ]
    }
];

/**
 * Connect to the WHO Global Health Observatory (GHO) OData API
 * To fetch global and regional maternal health indicator baselines
 */
export class WHOApiClient {
    private static baseUrl = "https://ghoapi.azureedge.net/api";

    /**
     * Fetch maternal health indicators metadata or sample data
     * E.g., MDG_0000000026 (Maternal mortality ratio) or ANC4 (Antenatal care 4+ visits)
     */
    static async getMaternalIndicator(indicatorCode: string = "MDG_0000000026"): Promise<any> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);
            
            const response = await fetch(`${this.baseUrl}/Indicator`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`WHO API returned HTTP ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (err) {
            console.warn("WHO GHO API fetch skipped or offline, using cached WHO Maternal Guidelines.", err);
            return null;
        }
    }

    /**
     * Search WHO maternal guidance relevant to user query
     */
    static searchGuidelines(query: string): WHOGuideline[] {
        const q = query.toLowerCase();
        return WHO_MATERNAL_GUIDELINES.filter(g => 
            g.topic.toLowerCase().includes(q) ||
            g.category.toLowerCase().includes(q) ||
            g.recommendation.toLowerCase().includes(q) ||
            g.keyPoints.some(k => k.toLowerCase().includes(q))
        );
    }

    /**
     * Format all WHO guidelines into a comprehensive system context for the AI Brain
     */
    static getWHOSystemPromptContext(): string {
        return WHO_MATERNAL_GUIDELINES.map(g => {
            return `### WHO Guideline: ${g.topic} (${g.whoSource})\nRecommendation: ${g.recommendation}\nKey Clinical Standards:\n${g.keyPoints.map(p => ` - ${p}`).join('\n')}`;
        }).join('\n\n');
    }
}
