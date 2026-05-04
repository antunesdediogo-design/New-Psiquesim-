
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { patients } from '../constants';
import type { PatientId, ScenarioId, Patient } from '../types';
import PatientCreatorCard from '../components/PatientCreatorCard';

interface DashboardPageProps {
  onStartSession: (patientId: PatientId, scenarioId: ScenarioId) => void;
  onLogout: () => void;
  onNavigateToPatientCreator: () => void;
}

const PatientCard: React.FC<{
  patient: Patient;
  onStartSession: (patientId: PatientId, scenarioId: ScenarioId) => void;
}> = ({ patient, onStartSession }) => {
  const { t } = useLanguage();
  const scenario = patient.scenario;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center mb-4">
          <img src={patient.avatarUrl} alt={t(patient.nameKey)} className="w-16 h-16 rounded-full mr-4" />
          <div>
            <h3 className="text-xl font-bold font-heading text-primary-dark">{t(patient.nameKey)}</h3>
          </div>
        </div>
        
        <div className="space-y-4 flex-grow">
           <h4 className="font-bold text-primary-dark">{t(scenario.titleKey)}</h4>
           <p className="text-sm text-gray-600 mt-1 mb-3">{t(scenario.descriptionKey)}</p>
           <div className="text-sm bg-primary-light/30 p-2 rounded-md">
             <strong className="font-semibold">{t('dashboard.scenarioObjective')}:</strong>
             <span className="text-gray-700 ml-1">{t(scenario.objectiveKey)}</span>
           </div>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 border-t">
        <button
          onClick={() => onStartSession(patient.id, scenario.id)}
          className="w-full bg-accent text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-opacity"
        >
          {t('dashboard.startSession')}
        </button>
      </div>
    </div>
  );
};


const DashboardPage: React.FC<DashboardPageProps> = ({ onStartSession, onLogout, onNavigateToPatientCreator }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <>
      <div className="min-h-screen bg-primary-light/20">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold font-heading text-primary-dark">PsiqueSim</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 hidden sm:block">{t('dashboard.welcome')}, {user?.name}!</span>
              <button
                onClick={onLogout}
                className="border border-primary-dark text-primary-dark px-4 py-2 rounded-md font-semibold hover:bg-primary-dark hover:text-white transition-colors"
              >
                {t('dashboard.logout')}
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold font-heading text-center text-primary-dark mb-10">
            {t('dashboard.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
            {patients.map((patient) => (
              <PatientCard 
                key={patient.id}
                patient={patient}
                onStartSession={onStartSession}
              />
            ))}
            <PatientCreatorCard onNavigate={onNavigateToPatientCreator} />
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardPage;