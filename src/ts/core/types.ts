// @ts-nocheck
export interface UserProfile {
  name?: string;
  lmp?: string; // Last menstrual period date string
  [key: string]: any;
}

export interface VitalLog {
  id: string;
  timestamp: string;
  [key: string]: any;
}

export interface BloodPressureLog extends VitalLog {
  sys: number;
  dia: number;
}

export interface GlucoseLog extends VitalLog {
  value: number;
  type: string; // Fasting, Post-meal
}

export interface UrineLog extends VitalLog {
  protein: string;
}
