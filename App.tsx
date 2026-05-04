
import React, { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ChatSessionPage from './pages/ChatSessionPage';
import ForIndividualsPage from './pages/ForIndividualsPage';
import ForInstitutionsPage from './pages/ForInstitutionsPage';
import PricingPage from './pages/PricingPage';
import FaqPage from './pages/FaqPage';
import HowItWorksPage from './pages/HowItWorksPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PatientCreatorPage from './pages/PatientCreatorPage';
import type { AuthMode, PatientId, ScenarioId, CustomPatientConfig, PredefinedSessionData, CustomSessionData } from './types';
import { generateCustomSystemInstruction } from './services/geminiService';


type View = 'landing' | 'auth' | 'dashboard' | 'chat' | 'forIndividuals' | 'forInstitutions' | 'pricing' | 'faq' | 'howItWorks' | 'privacyPolicy' | 'termsOfService' | 'patientCreator';

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const [view, setView] = useState<View>('landing');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [currentSessionData, setCurrentSessionData] = useState<PredefinedSessionData | CustomSessionData | null>(null);


  const handleLoginSuccess = useCallback(() => {
    setView('dashboard');
  }, []);
  
  const navigateToAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setView('auth');
  };

  const navigateToHome = () => setView('landing');
  const navigateToForIndividuals = () => setView('forIndividuals');
  const navigateToForInstitutions = () => setView('forInstitutions');
  const navigateToPricing = () => setView('pricing');
  const navigateToFaq = () => setView('faq');
  const navigateToHowItWorks = () => setView('howItWorks');
  const navigateToPrivacyPolicy = () => setView('privacyPolicy');
  const navigateToTermsOfService = () => setView('termsOfService');
  const navigateToPatientCreator = () => setView('patientCreator');


  const handleStartSession = useCallback((patientId: PatientId, scenarioId: ScenarioId) => {
    setCurrentSessionData({ mode: 'predefined', patientId, scenarioId });
    setView('chat');
  }, []);

  const handleStartCustomSession = (config: CustomPatientConfig) => {
    const systemInstruction = generateCustomSystemInstruction(config, language);
    setCurrentSessionData({
      mode: 'custom',
      config,
      systemInstruction,
    });
    setView('chat');
  };

  const handleEndSession = useCallback(() => {
    setCurrentSessionData(null);
    setView('dashboard');
  }, []);
  
  const handleLogout = useCallback(() => {
    logout();
    setView('landing');
  }, [logout]);


  if (user) {
    if (view === 'dashboard') {
      return <DashboardPage onStartSession={handleStartSession} onLogout={handleLogout} onNavigateToPatientCreator={navigateToPatientCreator} />;
    }
    if (view === 'patientCreator') {
        return <PatientCreatorPage onBackToDashboard={() => setView('dashboard')} onStartCustomSession={handleStartCustomSession} />;
    }
    if (view === 'chat' && currentSessionData) {
      return <ChatSessionPage
                // Use a key to ensure the component remounts when switching between sessions
                key={currentSessionData.mode === 'predefined' 
                    ? currentSessionData.scenarioId
                    : 'custom-session'}
                sessionData={currentSessionData}
                onEndSession={handleEndSession} 
             />;
    }
    // Default to dashboard if logged in but view is something else
    return <DashboardPage onStartSession={handleStartSession} onLogout={handleLogout} onNavigateToPatientCreator={navigateToPatientCreator} />;
  }
  
  const commonNavProps = {
    onNavigateToAuth: navigateToAuth,
    onNavigateHome: navigateToHome,
    onNavigateToForIndividuals: navigateToForIndividuals,
    onNavigateToForInstitutions: navigateToForInstitutions,
    onNavigateToPricing: navigateToPricing,
    onNavigateToFaq: navigateToFaq,
    onNavigateToHowItWorks: navigateToHowItWorks,
    onNavigateToPrivacyPolicy: navigateToPrivacyPolicy,
    onNavigateToTermsOfService: navigateToTermsOfService,
  };

  if (view === 'auth') {
    return <AuthPage mode={authMode} onLoginSuccess={handleLoginSuccess} onSwitchMode={navigateToHome} />;
  }
  
  if (view === 'forIndividuals') {
    return <ForIndividualsPage {...commonNavProps} />;
  }
  
  if (view === 'forInstitutions') {
    return <ForInstitutionsPage {...commonNavProps} />;
  }
  
  if (view === 'pricing') {
    return <PricingPage {...commonNavProps} />;
  }

  if (view === 'faq') {
    return <FaqPage {...commonNavProps} />;
  }
  
  if (view === 'howItWorks') {
    return <HowItWorksPage {...commonNavProps} />;
  }
  
  if (view === 'privacyPolicy') {
    return <PrivacyPolicyPage {...commonNavProps} />;
  }

  if (view === 'termsOfService') {
    return <TermsOfServicePage {...commonNavProps} />;
  }

  return <LandingPage {...commonNavProps} />;
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="bg-background-light text-primary-dark font-sans">
          <AppContent />
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;