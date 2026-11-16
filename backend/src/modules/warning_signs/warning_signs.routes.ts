/**
 * Maternal Warning Signs & Emergency Dispatch Metadata Routes (F8)
 * Standards: WHO & ACOG Obstetric Emergency Danger Signs
 * Security Mandate: Strictly static informational guidance; no automated predictive diagnosis or triage algorithms.
 * Scope: backend/src/modules/warning_signs/warning_signs.routes.ts
 */

import { Router } from '../../middleware/express_core';

export const warningSignsRouter = Router();

export const EMERGENCY_WARNING_SIGNS = [
  {
    id: 'vaginal_bleeding',
    name: 'Vaginal Bleeding or Spotting',
    severity: 'CRITICAL',
    description: 'Any vaginal bleeding, heavy or bright red spotting at any gestational stage.',
    action: 'Seek emergency obstetric evaluation immediately.'
  },
  {
    id: 'severe_headache_vision',
    name: 'Severe Persistent Headache with Vision Changes',
    severity: 'CRITICAL',
    description: 'Intense headache not relieved by acetaminophen, accompanied by blurred vision, double vision, seeing spots or flashing lights (potential sign of Preeclampsia).',
    action: 'Check blood pressure immediately and go to the nearest labor and delivery emergency department.'
  },
  {
    id: 'fetal_movement_reduction',
    name: 'Decreased or Absent Fetal Movement',
    severity: 'CRITICAL',
    description: 'Noticeable drop in kick frequency (fewer than 10 kicks in 2 hours when resting) or complete absence of fetal movement after 24 weeks.',
    action: 'Perform kick count check; if still decreased, proceed immediately to obstetric triage.'
  },
  {
    id: 'fluid_leakage',
    name: 'Sudden Gush or Continuous Leakage of Fluid',
    severity: 'CRITICAL',
    description: 'Watery clear or tinted fluid leaking from the vagina (potential premature rupture of membranes).',
    action: 'Do not use tampons; contact healthcare provider or hospital maternity unit immediately.'
  },
  {
    id: 'severe_abdominal_pain',
    name: 'Severe Abdominal or Epigastric Pain',
    severity: 'CRITICAL',
    description: 'Intense, sharp, or cramping pain in the abdomen, upper right quadrant, or lower pelvis.',
    action: 'Requires urgent clinical evaluation to rule out placental abruption or ectopic pregnancy.'
  },
  {
    id: 'sudden_facial_swelling',
    name: 'Sudden or Severe Swelling (Edema)',
    severity: 'HIGH',
    description: 'Rapid swelling of the face, around the eyes, or pronounced swelling of hands and fingers.',
    action: 'Contact your obstetrician or midwife for urgent preeclampsia assessment.'
  },
  {
    id: 'high_fever_chills',
    name: 'High Fever (> 38°C / 100.4°F) with Shivering',
    severity: 'HIGH',
    description: 'High temperature, chills, or burning with urination (potential maternal systemic or intrauterine infection).',
    action: 'Consult maternal healthcare provider promptly for diagnostic evaluation.'
  },
  {
    id: 'dyspnea_chest_pain',
    name: 'Difficulty Breathing or Chest Pain',
    severity: 'CRITICAL',
    description: 'Sudden shortness of breath, rapid heart rate, or chest pain.',
    action: 'Call emergency medical services immediately.'
  }
];

export const EMERGENCY_DISPATCH_METADATA = {
  global_services: [
    { country: 'United States & Canada', service: 'Emergency Dispatch', number: '911' },
    { country: 'European Union & Global', service: 'Universal Emergency', number: '112' },
    { country: 'United Kingdom', service: 'Emergency Services', number: '999' },
    { country: 'India', service: 'Ambulance & Maternal Emergency', number: '108 / 102' },
    { country: 'Australia', service: 'Emergency Services', number: '000' }
  ],
  crisis_support: [
    { name: 'National Maternal Mental Health Hotline (US)', contact: '1-833-852-6262', available: '24/7 Free & Confidential' },
    { name: 'Crisis Text Line', contact: 'Text HOME to 741741', available: '24/7' }
  ]
};

// GET /api/v1/warning-signs - Static Obstetric Danger Signs and Emergency Dispatch
warningSignsRouter.get(
  '/',
  (req: any, res: any) => {
    res.status(200).json({
      disclaimer: 'This application provides strictly informational guidance and DOES NOT perform automated clinical diagnosis. If you experience any obstetric danger signs, contact emergency services or proceed to the nearest emergency room immediately.',
      danger_signs: EMERGENCY_WARNING_SIGNS,
      dispatch: EMERGENCY_DISPATCH_METADATA
    });
  }
);
