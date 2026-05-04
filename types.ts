export enum Language {
  EN = 'en',
  ES = 'es',
}

export type AuthMode = 'login' | 'signup';

export interface NavigationProps {
    onNavigateToAuth: (mode: AuthMode) => void;
    onNavigateHome: () => void;
    onNavigateToForIndividuals: () => void;
    onNavigateToForInstitutions: () => void;
    onNavigateToPricing: () => void;
    onNavigateToFaq: () => void;
    onNavigateToHowItWorks: () => void;
    onNavigateToPrivacyPolicy: () => void;
    onNavigateToTermsOfService: () => void;
}

export type User = {
  name: string;
  email: string;
} | null;

export enum PatientId {
  TomasPerez = 'tomas-perez',
  AntoniaFlores = 'antonia-flores',
  JacintaJimenez = 'jacinta-jimenez',
  MartinJara = 'martin-jara',
  DiegoSanchez = 'diego-sanchez',
}

export enum ScenarioId {
  TomasExceptions = 'tomas-exceptions',
  TomasResistance = 'tomas-resistance',
  AntoniaGoals = 'antonia-goals',
  AntoniaIdentity = 'antonia-identity',
  JacintaResources = 'jacinta-resources',
  MartinRupture = 'martin-rupture',
  DiegoRelapse = 'diego-relapse',
}

export type EmotionalState =
  | 'Cooperative'
  | 'Anxious'
  | 'Resistant'
  | 'Hopeful'
  | 'Guarded'
  | 'Open'
  | 'Neutral';


export interface PatientDemographics {
  titleKey: string;
  ageKey: string;
  ageValueKey: string;
  genderKey: string;
  genderValueKey: string;
  occupationKey: string;
  occupationValueKey: string;
  locationKey: string;
  locationValueKey: string;
}

export interface Scenario {
  id: ScenarioId;
  titleKey: string;
  descriptionKey: string;
  objectiveKey: string;
  sessionContextKey: string;
}

export interface Patient {
  id: PatientId;
  nameKey: string;
  cardDescriptionKey: string;
  avatarUrl: string;
  voiceName: string;
  presentingProblemKey: string;
  demographics: PatientDemographics;
  clinicalPresentationKey: string;
  scenario: Scenario;
}

// For Session Transcripts
export interface TranscriptionLine {
  speaker: 'user' | 'model';
  text: string;
  timestamp: number;
}

// For Session Analytics
export interface KeyMoment {
  emoji: string;
  title: string;
  explanation: string;
  transcriptSnippet: string;
}

export interface QuantitativeScores {
  empathy: number; // 0-100
  rapportBuilding: number; // 0-100
  techniqueAdherence: number; // 0-100
}

export interface QuestionAnalysis {
  openEnded: number;
  closedEnded: number;
  reflective: number;
  other: number;
}

export interface SessionAnalyticsData {
  overallSummary: string;
  strengths: KeyMoment[];
  areasForImprovement: KeyMoment[];
  keyMoments: KeyMoment[];
  quantitativeScores: QuantitativeScores;
  questionAnalysis: QuestionAnalysis;
  emotionalJourney: { state: EmotionalState; turn: number }[];
}


// Types for Patient Creator
export type TherapeuticModel = 'sfb' | 'cbt' | 'mi';
export type Gender = 'male' | 'female' | 'non-binary';
export type AgeRange = '20-30' | '30-40' | '40-50' | '50+';
export type SocioeconomicStatus = 'low' | 'middle' | 'high';
export type PresentingProblem = 'procrastination' | 'social-anxiety' | 'relationship-conflict' | 'low-self-esteem' | 'grief';
export type PatientAttitude = 'cooperative' | 'anxious-guarded' | 'skeptical-resistant';
export type RelationalStyle = 'secure' | 'anxious' | 'avoidant' | 'disorganized';
export type CopingMechanism = 'avoidance' | 'intellectualization' | 'humor' | 'externalizing';

export interface CustomPatientConfig {
  model: TherapeuticModel;
  gender: Gender;
  ageRange: AgeRange;
  ses: SocioeconomicStatus;
  problems: PresentingProblem[];
  attitude: PatientAttitude;
  relationalStyle: RelationalStyle;
  copingMechanisms: CopingMechanism[];
  hiddenConcern?: string;
}
export type PredefinedSessionData = {
  mode: 'predefined';
  patientId: PatientId;
  scenarioId: ScenarioId;
};

export type CustomSessionData = {
  mode: 'custom';
  config: CustomPatientConfig;
  systemInstruction: string;
};