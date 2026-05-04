import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import SparklesIcon from './icons/SparklesIcon';

interface PatientCreatorCardProps {
    onNavigate: () => void;
}

const PatientCreatorCard: React.FC<PatientCreatorCardProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  return (
    <div 
        onClick={onNavigate}
        className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col p-6 items-center justify-center text-center border-2 border-dashed border-primary-light hover:border-accent hover:bg-gray-50 transition-all duration-300 cursor-pointer group h-full"
    >
        <SparklesIcon className="w-16 h-16 text-primary-light group-hover:text-accent transition-colors duration-300 mb-4" />
        <h3 className="text-xl font-bold font-heading text-primary-dark">{t('patientCreator.cardTitle')}</h3>
        <p className="text-gray-600 mt-2">{t('patientCreator.cardDescription')}</p>
    </div>
  );
}

export default PatientCreatorCard;
