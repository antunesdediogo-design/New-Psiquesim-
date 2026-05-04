import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TargetIcon from '../components/icons/TargetIcon';
import ShieldCheckIcon from '../components/icons/ShieldCheckIcon';
import ChartBarIcon from '../components/icons/ChartBarIcon';
import type { NavigationProps } from '../types';


const ForIndividualsPage: React.FC<NavigationProps> = (navProps) => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen flex flex-col">
            <Header {...navProps} />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-primary-light/20 text-center py-20 px-6">
                    <h2 className="text-4xl md:text-5xl font-bold font-heading text-primary-dark mb-4">{t('forIndividualsPage.heroTitle')}</h2>
                    <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">{t('forIndividualsPage.heroSubtitle')}</p>
                    <button 
                        onClick={() => navProps.onNavigateToAuth('signup')}
                        className="bg-accent text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-opacity-90 transition-opacity transform hover:scale-105"
                    >
                        {t('forIndividualsPage.heroCta')}
                    </button>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <h3 className="text-3xl font-bold font-heading text-center text-primary-dark mb-12">{t('forIndividualsPage.featuresTitle')}</h3>
                        <div className="grid md:grid-cols-3 gap-12 text-center max-w-6xl mx-auto">
                            <div className="flex flex-col items-center p-6">
                                <TargetIcon className="w-16 h-16 text-accent mb-4"/>
                                <h4 className="text-xl font-bold text-primary-dark mb-2">{t('forIndividualsPage.feature1Title')}</h4>
                                <p className="text-gray-600">{t('forIndividualsPage.feature1Desc')}</p>
                            </div>
                            <div className="flex flex-col items-center p-6">
                                <ShieldCheckIcon className="w-16 h-16 text-accent mb-4"/>
                                <h4 className="text-xl font-bold text-primary-dark mb-2">{t('forIndividualsPage.feature2Title')}</h4>
                                <p className="text-gray-600">{t('forIndividualsPage.feature2Desc')}</p>
                            </div>
                            <div className="flex flex-col items-center p-6">
                                <ChartBarIcon className="w-16 h-16 text-accent mb-4"/>
                                <h4 className="text-xl font-bold text-primary-dark mb-2">{t('forIndividualsPage.feature3Title')}</h4>
                                <p className="text-gray-600">{t('forIndividualsPage.feature3Desc')}</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Testimonial Section */}
                <section className="bg-primary-light/20 py-20 px-6">
                     <div className="container mx-auto max-w-3xl text-center">
                        <img src="https://picsum.photos/seed/ana-rojas/100/100" alt="Dr. Ana Rojas" className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-white shadow-lg"/>
                        <p className="text-xl italic text-primary-dark mb-4">
                           {t('forIndividualsPage.testimonialText')}
                        </p>
                        <p className="font-semibold text-gray-700">{t('forIndividualsPage.testimonialAuthor')}</p>
                     </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-white text-center px-6">
                    <h3 className="text-3xl font-bold font-heading text-primary-dark mb-4">{t('forIndividualsPage.ctaTitle')}</h3>
                    <button 
                        onClick={() => navProps.onNavigateToAuth('login')}
                        className="bg-accent text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-opacity-90 transition-opacity"
                    >
                         {t('forIndividualsPage.ctaButton')}
                    </button>
                </section>
            </main>
            <Footer {...navProps} />
        </div>
    );
};

export default ForIndividualsPage;