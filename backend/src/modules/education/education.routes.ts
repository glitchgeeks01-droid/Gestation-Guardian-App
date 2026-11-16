/**
 * WHO-Aligned Educational Guidance Routes (F7)
 * Standards: World Health Organization (WHO) Antenatal Care Recommendations
 * Scope: backend/src/modules/education/education.routes.ts
 */

import { Router } from '../../middleware/express_core';

export const educationRouter = Router();

export const MANDATORY_MEDICAL_DISCLAIMER =
  'This educational information is aligned with World Health Organization (WHO) antenatal care recommendations and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified health provider with any questions.';

interface WeekGuidance {
  title: string;
  fetal_development: string;
  maternal_changes: string;
  recommended_care: string[];
}

function getWeekGuidance(week: number): WeekGuidance {
  if (week <= 4) {
    return {
      title: 'Conception and Early Implantation',
      fetal_development: 'Blastocyst implants into the uterine lining. The neural tube and early placenta begin to develop.',
      maternal_changes: 'Hormonal shifts with elevated human chorionic gonadotropin (hCG). Possible mild fatigue or tender breasts.',
      recommended_care: [
        'Initiate daily supplementation of 400 mcg folic acid.',
        'Avoid tobacco, alcohol, and unprescribed medications.'
      ]
    };
  }

  if (week <= 8) {
    return {
      title: 'Organogenesis & Embryonic Development',
      fetal_development: 'The heart begins beating. Limb buds, eye structures, and major organ systems take rudimentary form.',
      maternal_changes: 'Morning sickness, heightened olfactory sensitivity, frequent urination.',
      recommended_care: [
        'Schedule first comprehensive antenatal clinical evaluation (WHO ANC contact 1).',
        'Maintain balanced maternal nutrition and stay well hydrated.'
      ]
    };
  }

  if (week <= 13) {
    return {
      title: 'Late First Trimester Transition',
      fetal_development: 'Fetus is fully formed from crown to rump (approximately 7-8 cm). Facial features and reflexes begin.',
      maternal_changes: 'Energy levels begin stabilizing; nausea often starts subsiding.',
      recommended_care: [
        'Complete baseline blood investigations (blood group, Rh, hemoglobin, infectious screening).',
        'Offer first-trimester ultrasound for gestational dating.'
      ]
    };
  }

  if (week <= 20) {
    return {
      title: 'Second Trimester Rapid Growth',
      fetal_development: 'Rapid skeleton ossification. Sensory development allows detection of maternal voice. Vernix caseosa forms.',
      maternal_changes: 'Noticeable baby bump. First perception of fetal kicks (quickening) typically between weeks 18-20.',
      recommended_care: [
        'Mid-trimester morphology and structural anomaly ultrasound scan (18-22 weeks).',
        'Screening for maternal anemia and blood pressure tracking.'
      ]
    };
  }

  if (week <= 27) {
    return {
      title: 'Viability & Lung Maturation',
      fetal_development: 'Lungs begin developing surfactant. Fetal sleep-wake cycles emerge. Weight reaches approximately 1 kg.',
      maternal_changes: 'Increased uterine pressure; backaches and mild edema of lower extremities may occur.',
      recommended_care: [
        'Oral glucose tolerance screening (OGTT) for gestational diabetes between 24-28 weeks.',
        'Continuous monitoring of maternal blood pressure for preeclampsia screening.'
      ]
    };
  }

  if (week <= 36) {
    return {
      title: 'Third Trimester Fetal Weight Accretion',
      fetal_development: 'Substantial subcutaneous fat accumulation. Rapid brain development and reflexive breathing movements.',
      maternal_changes: 'Braxton Hicks practice contractions; pelvic pressure and shortness of breath.',
      recommended_care: [
        'Regular antenatal checks every 2 to 3 weeks (WHO ANC contacts 4-6).',
        'Fetal movement (kick count) self-monitoring and counseling on danger signs.'
      ]
    };
  }

  // Weeks 37-42
  return {
    title: 'Full Term & Labor Preparation',
    fetal_development: 'Full term gestation reached. Lungs mature and head engages into the maternal pelvic inlet.',
    maternal_changes: 'Cervical softening and effacement. Frequent contractions and lightening sensation.',
    recommended_care: [
      'Weekly antenatal assessments monitoring maternal blood pressure and fetal position.',
      'Review birth preparedness and complication readiness plan.',
      'Identify hospital transport and emergency support contacts.'
    ]
  };
}

// GET /api/v1/education/week/:weekNumber - Retrieve WHO-aligned guidance
educationRouter.get(
  '/week/:weekNumber',
  (req: any, res: any) => {
    const rawWeek = req.params.weekNumber;
    const week = parseInt(rawWeek, 10);

    if (isNaN(week) || week < 1 || week > 42 || !Number.isInteger(Number(rawWeek))) {
      return res.status(400).json({
        error: 'Bad Request',
        code: 'INVALID_GESTATIONAL_WEEK',
        message: 'Gestational week must be an integer between 1 and 42.'
      });
    }

    const guidance = getWeekGuidance(week);

    res.status(200).json({
      week_number: week,
      title: `Week ${week}: ${guidance.title}`,
      fetal_development: guidance.fetal_development,
      maternal_changes: guidance.maternal_changes,
      recommended_care: guidance.recommended_care,
      medical_disclaimer: MANDATORY_MEDICAL_DISCLAIMER
    });
  }
);
