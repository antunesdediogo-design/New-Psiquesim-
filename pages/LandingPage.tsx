import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { NavigationProps } from '../types';

interface LandingPageProps extends NavigationProps {}

const Hero: React.FC<{ onCtaClick: () => void }> = ({ onCtaClick }) => {
    const { t } = useLanguage();
    return (
        <section className="bg-primary-light/20">
            <div className="container mx-auto px-6 py-24 text-center">
                <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary-dark mb-4 leading-tight">
                    {t('hero.headline')}
                </h2>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
                    {t('hero.subheadline')}
                </p>
                <button 
                    onClick={onCtaClick}
                    className="bg-accent text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-opacity-90 transition-opacity transform hover:scale-105"
                >
                    {t('hero.cta')}
                </button>
                 <div className="mt-12">
                    <img src="https://picsum.photos/seed/psiquesim-hero/1200/400" alt="Abstract professional interaction" className="rounded-lg shadow-xl mx-auto w-full max-w-5xl object-cover h-64" />
                </div>
            </div>
        </section>
    );
};

const HowItWorks = () => {
    const { t } = useLanguage();
    const steps = [
        { title: t('howItWorks.step1Title'), desc: t('howItWorks.step1Desc') },
        { title: t('howItWorks.step2Title'), desc: t('howItWorks.step2Desc') },
        { title: t('howItWorks.step3Title'), desc: t('howItWorks.step3Desc') },
    ];
    return (
        <section id="how-it-works" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <h3 className="text-3xl font-bold font-heading text-center text-primary-dark mb-12">{t('howItWorks.title')}</h3>
                <div className="grid md:grid-cols-3 gap-12 text-center">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="bg-primary-light text-primary-dark w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                                {index + 1}
                            </div>
                            <h4 className="text-xl font-bold text-primary-dark mb-2">{step.title}</h4>
                            <p className="text-gray-600">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const LandingPage: React.FC<LandingPageProps> = (navProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        {...navProps}
      />
      <main className="flex-grow">
        <Hero onCtaClick={() => navProps.onNavigateToAuth('signup')} />
        <HowItWorks />
      </main>
      <Footer {...navProps} />
    </div>
  );
};

export default LandingPage;