import React from 'react';
import type { PatientId, PatientDemographics, CustomPatientConfig } from '../types';
import { patients } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import CloseIcon from './icons/CloseIcon';
import EyeIcon from './icons/EyeIcon';
import UsersIcon from './icons/UsersIcon';

interface PatientInfoSidebarProps {
  patientId?: PatientId;
  customConfig?: CustomPatientConfig;
  isOpen: boolean;
  onClose: () => void;
}

const PatientInfoSidebar: React.FC<PatientInfoSidebarProps> = ({ patientId, customConfig, isOpen, onClose }) => {
  const { t } = useLanguage();
  
  if (!patientId && !customConfig) return null;

  const patient = patientId ? patients.find(p => p.id === patientId) : null;

  const renderPredefinedPatientInfo = () => {
    if (!patient) return null;
    const demographicValueKeys = Object.keys(patient.demographics)
      .filter(key => key !== 'titleKey' && key.endsWith('ValueKey')) as (keyof PatientDemographics)[];

    return (
      <>
        <section>
          <h3 className="text-lg font-bold font-heading text-primary-dark mb-2">{t('sidebar.presentingProblem')}</h3>
          <p className="text-gray-600">{t(patient.presentingProblemKey)}</p>
        </section>

        <section>
          <h3 className="text-lg font-bold font-heading text-primary-dark mb-2">{t('sidebar.sessionContext')}</h3>
          <p className="text-gray-600">{t(patient.scenario.sessionContextKey)}</p>
        </section>

        <section>
          <h3 className="text-lg font-bold font-heading text-primary-dark mb-3">{t(patient.demographics.titleKey)}</h3>
          <div className="space-y-2 text-gray-600">
            {demographicValueKeys.map((valueKey) => {
              const labelKeyName = (valueKey as string).replace('ValueKey', 'Key') as keyof PatientDemographics;
              const labelTranslationKey = patient.demographics[labelKeyName];
              const valueTranslationKey = patient.demographics[valueKey];
              return (
                <div key={labelKeyName} className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-700">{t(labelTranslationKey as string)}:</span>
                  <span>{t(valueTranslationKey as string)}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold font-heading text-primary-dark mb-2">{t('sidebar.clinicalPresentation')}</h3>
          <p className="text-gray-600">{t(patient.clinicalPresentationKey)}</p>
        </section>
      </>
    );
  };
  
  const renderCustomPatientInfo = () => {
      if (!customConfig) return null;
      return (
        <>
            <section>
                <h3 className="text-lg font-bold font-heading text-primary-dark mb-2">{t('patientCreator.summary_model')}</h3>
                <p className="text-gray-600">{t(`patientCreator.model_${customConfig.model}`)}</p>
            </section>
            <section>
                <h3 className="text-lg font-bold font-heading text-primary-dark mb-3">{t('sidebar.demographics')}</h3>
                <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between text-sm">
                        <span className="font-semibold text-gray-700">{t('patientCreator.gender')}:</span>
                        <span>{t(`patientCreator.gender_${customConfig.gender}`)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="font-semibold text-gray-700">{t('patientCreator.age')}:</span>
                        <span>{t(`patientCreator.age_${customConfig.ageRange}`)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="font-semibold text-gray-700">{t('patientCreator.ses')}:</span>
                        <span>{t(`patientCreator.ses_${customConfig.ses}`)}</span>
                    </div>
                </div>
            </section>
             <section>
                <h3 className="text-lg font-bold font-heading text-primary-dark mb-2">{t('sidebar.interpersonalStyle')}</h3>
                <p className="text-gray-600">{t(`patientCreator.style_${customConfig.relationalStyle}`)}</p>
            </section>
             <section>
                <h3 className="text-lg font-bold font-heading text-primary-dark mb-2">{t('sidebar.copingMechanisms')}</h3>
                <p className="text-gray-600">{customConfig.copingMechanisms.map(c => t(`patientCreator.mechanism_${c}`)).join(', ')}</p>
            </section>
            <section>
                <h3 className="text-lg font-bold font-heading text-primary-dark mb-2">{t('sidebar.presentingProblem')}</h3>
                <p className="text-gray-600">{customConfig.problems.map(p => t(`patientCreator.problem_${p}`)).join(', ')}</p>
            </section>
            <section>
                <h3 className="text-lg font-bold font-heading text-primary-dark mb-2">{t('patientCreator.attitude')}</h3>
                <p className="text-gray-600">{t(`patientCreator.attitude_${customConfig.attitude}`)}</p>
            </section>
            {customConfig.hiddenConcern && (
                <section className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                    <h3 className="flex items-center space-x-2 text-lg font-bold font-heading text-amber-800 mb-2">
                        <EyeIcon className="w-5 h-5"/>
                        <span>{t('sidebar.hiddenConcern')}</span>
                    </h3>
                    <p className="text-amber-700 italic">"{customConfig.hiddenConcern}"</p>
                </section>
            )}
        </>
      )
  }

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black/60 z-30 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-80 lg:w-96 h-full bg-white text-primary-dark border-r border-gray-200
        flex flex-col shrink-0
        transition-transform transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold font-heading">{t('sidebar.title')}</h2>
          <button onClick={onClose} className="md:hidden p-1 rounded-full hover:bg-gray-100">
            <CloseIcon className="w-6 h-6"/>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {customConfig ? renderCustomPatientInfo() : renderPredefinedPatientInfo()}
        </div>
      </aside>
    </>
  );
};

export default PatientInfoSidebar;