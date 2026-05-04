import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import type { NavigationProps } from '../types';

const Header: React.FC<NavigationProps> = ({ onNavigateToAuth, onNavigateHome, onNavigateToForIndividuals, onNavigateToForInstitutions, onNavigateToPricing, onNavigateToFaq, onNavigateToHowItWorks, onNavigateToPrivacyPolicy, onNavigateToTermsOfService }) => {
  const { t } = useLanguage();

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <button onClick={onNavigateHome} className="text-2xl font-bold font-heading text-primary-dark">PsiqueSim</button>
        <div className="hidden md:flex items-center space-x-8">
          <button onClick={onNavigateToHowItWorks} className="text-gray-600 hover:text-primary-dark">{t('header.howItWorks')}</button>
          <button onClick={onNavigateToForIndividuals} className="text-gray-600 hover:text-primary-dark">{t('header.forIndividuals')}</button>
          <button onClick={onNavigateToForInstitutions} className="text-gray-600 hover:text-primary-dark">{t('header.forInstitutions')}</button>
          <button onClick={onNavigateToPricing} className="text-gray-600 hover:text-primary-dark">{t('header.pricing')}</button>
          <button onClick={onNavigateToFaq} className="text-gray-600 hover:text-primary-dark">{t('header.faq')}</button>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <button onClick={() => onNavigateToAuth('login')} className="hidden sm:block border border-primary-dark text-primary-dark px-4 py-2 rounded-md font-semibold hover:bg-primary-dark hover:text-white transition-colors">
            {t('header.login')}
          </button>
          <button onClick={() => onNavigateToAuth('signup')} className="bg-accent text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-opacity">
            {t('header.signup')}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;